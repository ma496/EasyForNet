using Backend.Features.Users;

namespace Tests.Features.Users;

public class UserGetTests : AppTestsBase
{
    public UserGetTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task Get_User()
    {
        UserCreateRequest request = new()
        {
            Username = "getuser",
            Email = "get@example.com",
            Password = "Password123!",
            FirstName = "Get",
            LastName = "User",
            IsActive = true
        };
        var (createRsp, createRes) = await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, UserCreateResponse>(request);

        createRsp.StatusCode.Should().Be(HttpStatusCode.OK);

        var (getRsp, getRes) = await App.Client.GETAsync<UserGetEndpoint, UserGetRequest, UserGetResponse>(
            new()
            {
                Id = createRes.Id
            });

        getRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        getRes.Username.Should().Be(request.Username);
        getRes.Email.Should().Be(request.Email);
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