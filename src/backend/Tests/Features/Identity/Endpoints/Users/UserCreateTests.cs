namespace Backend.Tests.Features.Identity.Endpoints.Users;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Endpoints.Users;
using Backend.Tests.Seeder;

/// <summary>
/// Tests for the <see cref="UserCreateEndpoint"/> covering validation and successful user creation.
/// </summary>
public class UserCreateTests(App app) : AppTestsBase(app)
{
    /// <summary>
    /// Verifies that invalid input returns a 400 Bad Request with validation errors for all required fields.
    /// </summary>
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
        res.Errors.Count().Should().Be(6);
        res.Errors.Select(e => e.Name).Should().Equal("username", "email", "password", "firstName", "lastName", "roles");
    }

    /// <summary>
    /// Verifies that a valid user creation request returns 200 OK with the correct user details and assigned roles.
    /// </summary>
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
        request.Roles = [TestRoles.TestRoleId];
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