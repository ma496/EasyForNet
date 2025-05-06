using Backend;
using Backend.ErrorHandling;
using Backend.Features.Users;
using Backend.Services.Identity;
using Tests.Seeder;

namespace Tests.Features.Users;

public class UserDeleteTests : AppTestsBase
{
    public UserDeleteTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task Delete_User()
    {
        UserCreateRequest request = new()
        {
            Username = $"deleteuser{Helper.UniqueNumber()}",
            Email = $"delete{Helper.UniqueNumber()}@example.com",
            Password = "Password123!",
            FirstName = "Delete",
            LastName = "User",
            IsActive = true
        };
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