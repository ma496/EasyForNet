using Backend.Features.Users;

namespace Tests.Users;

public class UserCreateTests : MyTestsBase
{
    public UserCreateTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task Invalid_Input()
    {
        var (rsp, res) = await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, ProblemDetails>(
            new()
            {
                Username = "a",
                Email = "invalid-email",
                Password = "123",
                FirstName = "",
                LastName = "",
                IsActive = true
            });

        rsp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        res.Errors.Count().Should().Be(3);
        res.Errors.Select(e => e.Name).Should().Equal("username", "email", "password");
    }

    [Fact]
    public async Task Valid_Input()
    {
        var (rsp, res) = await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, UserCreateResponse>(
            new()
            {
                Username = "test123",
                Email = "test123@example.com",
                Password = "Password123!",
                FirstName = "Test",
                LastName = "User",
                IsActive = true
            });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Username.Should().Be("test123");
        res.Email.Should().Be("test123@example.com");
        res.FirstName.Should().Be("Test");
        res.LastName.Should().Be("User");
        res.IsActive.Should().BeTrue();
    }
}