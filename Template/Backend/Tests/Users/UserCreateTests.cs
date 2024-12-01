using Backend.Features.Users;
using Backend.Services.Identity;
using Tests.Seeder;

namespace Tests.Users;

public class UserCreateTests : AppTestsBase
{
    public UserCreateTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task Invalid_Input()
    {
        UserCreateRequest request = new()
        {
            Username = "a",
            Email = "invalid-email",
            Password = "123",
            FirstName = "",
            LastName = "",
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
        var roleService = App.Services.GetRequiredService<IRoleService>();
        UserCreateRequest request = new()
        {
            Username = "test123",
            Email = "test123@example.com",
            Password = "Password123!",
            FirstName = "Test",
            LastName = "User",
            IsActive = true,
            Roles = [(await roleService.GetByNameAsync(RoleConst.Test))!.Id]
        };
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