namespace Backend.Tests.Features.Identity.Endpoints.Users;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Endpoints.Users;

public class UserUpdateTests(App app) : AppTestsBase(app)
{
    [Fact]
    public async Task Update_User()
    {
        await SetAuthTokenAsync();

        var roleService = App.Services.GetRequiredService<IRoleService>();
        var faker = new Faker<UserCreateRequest>()
            .RuleFor(u => u.Username, f => f.Internet.UserName() + f.UniqueIndex)
            .RuleFor(u => u.Email, f => f.Internet.Email() + f.UniqueIndex)
            .RuleFor(u => u.Password, f => f.Internet.Password())
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName())
            .RuleFor(u => u.IsActive, f => true);
        var request = faker.Generate();
        request.Roles = [(await roleService.GetByNameAsync(RoleConst.Test))!.Id];
        var (createRsp, createRes) = await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, UserCreateResponse>(request);

        createRsp.StatusCode.Should().Be(HttpStatusCode.OK);

        var updateFaker = new Faker<UserUpdateRequest>()
            .RuleFor(u => u.Id, f => createRes.Id)
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName())
            .RuleFor(u => u.IsActive, f => false);
        var updateRequest = updateFaker.Generate();
        updateRequest.Roles = [(await roleService.GetByNameAsync(RoleConst.TestOne))!.Id, (await roleService.GetByNameAsync(RoleConst.TestTwo))!.Id];
        var (updateRsp, updateRes) = await App.Client.PUTAsync<UserUpdateEndpoint, UserUpdateRequest, UserUpdateResponse>(updateRequest);

        updateRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        updateRes.FirstName.Should().Be(updateRequest.FirstName);
        updateRes.LastName.Should().Be(updateRequest.LastName);
        updateRes.IsActive.Should().Be(updateRequest.IsActive);
        updateRes.Roles.Should().Equal(updateRequest.Roles);
    }

    [Fact]
    public async Task Update_NonExistent_User()
    {
        await SetAuthTokenAsync();

        var updateFaker = new Faker<UserUpdateRequest>()
            .RuleFor(u => u.Id, f => Guid.NewGuid())
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName())
            .RuleFor(u => u.IsActive, f => true);
        var updateRequest = updateFaker.Generate();
        var (updateRsp, _) = await App.Client.PUTAsync<UserUpdateEndpoint, UserUpdateRequest, UserUpdateResponse>(updateRequest);

        updateRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Update_Admin_User_Should_Fail()
    {
        await SetAuthTokenAsync();

        // Get the default user
        var defaultUser = await App.Services.GetRequiredService<IUserService>()
            .Users()
            .FirstAsync(u => u.Username == "admin", cancellationToken: TestContext.Current.CancellationToken);

        var roleService = App.Services.GetRequiredService<IRoleService>();
        var (updateRsp, res) = await App.Client.PUTAsync<UserUpdateEndpoint, UserUpdateRequest, ProblemDetails>(
            new()
            {
                Id = defaultUser.Id,
                FirstName = "Modified",
                LastName = "Default",
                IsActive = false,
                Roles = [(await roleService.GetByNameAsync(RoleConst.Test))!.Id]
            });

        updateRsp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        res.Errors.Should().ContainSingle();
        res.Errors.First().Code.Should().Be(ErrorCodes.DefaultUserCannotBeUpdated);
    }
}