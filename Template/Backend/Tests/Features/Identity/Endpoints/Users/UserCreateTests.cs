namespace Backend.Tests.Features.Identity.Endpoints.Users;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Endpoints.Users;
using Backend.Tests.Seeder;

public class UserCreateTests(App app) : AppTestsBase(app)
{
    [Fact]
    public async Task Invalid_Input()
    {
        await SetAuthTokenAsync();

        var request = new UserCreateRequest
        {
            Username = "a",
            Email = "invalid-email",
            Password = "123",
            FirstName = "a",
            LastName = "a",
            IsActive = true
        };
        var (rsp, res) = await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, ProblemDetails>(request);

        rsp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        res.Errors.Count().Should().Be(5);
        res.Errors.Select(e => e.Name).Should().Equal("username", "email", "password", "firstName", "lastName");
    }

    [Fact]
    public async Task Valid_Input()
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
        var (rsp, res) = await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, UserCreateResponse>(request);

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Username.Should().Be(request.Username);
        res.Email.Should().Be(request.Email);
        res.FirstName.Should().Be(request.FirstName);
        res.LastName.Should().Be(request.LastName);
        res.IsActive.Should().Be(request.IsActive);
        res.Roles.Should().Equal(request.Roles);
    }
}