using Backend.Features.Users;

namespace Tests.Users;

public class UserGetTests : MyTestsBase
{
    public UserGetTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task Get_User()
    {
        // First create a user
        var (createRsp, createRes) = await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, UserCreateResponse>(
            new()
            {
                Username = "getuser",
                Email = "get@example.com",
                Password = "Password123!",
                FirstName = "Get",
                LastName = "User",
                IsActive = true
            });

        // Then get the user
        var (getRsp, getRes) = await App.Client.GETAsync<UserGetEndpoint, UserGetRequest, UserGetResponse>(
            new()
            {
                Id = createRes.Id
            });

        getRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        getRes.Username.Should().Be("getuser");
        getRes.Email.Should().Be("get@example.com");
    }

    [Fact]
    public async Task Get_NonExistent_User()
    {
        var (getRsp, _) = await App.Client.GETAsync<UserGetEndpoint, UserGetRequest, UserGetResponse>(
            new()
            {
                Id = Guid.NewGuid()
            });

        getRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}