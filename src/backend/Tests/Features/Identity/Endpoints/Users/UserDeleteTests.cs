namespace Backend.Tests.Features.Identity.Endpoints.Users;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Endpoints.Users;

public class UserDeleteTests(App app) : AppTestsBase(app)
{
    [Fact]
    public async Task Delete_User()
    {
        await SetAuthTokenAsync();

        var faker = new Faker<UserCreateRequest>()
            .RuleFor(u => u.Username, f => f.Internet.UserName() + f.UniqueIndex)
            .RuleFor(u => u.Email, f => f.Internet.Email() + f.UniqueIndex)
            .RuleFor(u => u.Password, f => f.Internet.Password())
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName())
            .RuleFor(u => u.IsActive, f => true);
        var request = faker.Generate();
        var (createRsp, createRes) = await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, UserCreateResponse>(request);

        createRsp.StatusCode.Should().Be(HttpStatusCode.OK);

        // Then delete the user
        var (deleteRsp, deleteRes) = await App.Client.DELETEAsync<UserDeleteEndpoint, UserDeleteRequest, UserDeleteResponse>(
            new()
            {
                Id = createRes.Id
            });

        deleteRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        deleteRes.Success.Should().BeTrue();

        // Verify user is deleted by trying to get it
        var (getRsp, _) = await App.Client.GETAsync<UserGetEndpoint, UserGetRequest, UserGetResponse>(
            new()
            {
                Id = createRes.Id
            });

        getRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_NonExistent_User()
    {
        await SetAuthTokenAsync();

        var (deleteRsp, _) = await App.Client.DELETEAsync<UserDeleteEndpoint, UserDeleteRequest, UserDeleteResponse>(
            new()
            {
                Id = Guid.NewGuid()
            });

        deleteRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Cannot_Delete_Admin_User()
    {
        await SetAuthTokenAsync();

        // Get the default user (admin from seeder)
        var userService = App.Services.GetRequiredService<IUserService>();
        var defaultUser = await userService.GetByUsernameAsync("admin");
        defaultUser.Should().NotBeNull();

        // Try to delete the default user
        var (deleteRsp, res) = await App.Client.DELETEAsync<UserDeleteEndpoint, UserDeleteRequest, ProblemDetails>(
            new()
            {
                Id = defaultUser!.Id
            });

        deleteRsp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        res.Errors.Should().ContainSingle();
        res.Errors.First().Code.Should().Be(ErrorCodes.DefaultUserCannotBeDeleted);
    }
}