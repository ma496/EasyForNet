using Backend.Features.Users;

namespace Tests.Users;

public class UserUpdateTests : MyTestsBase
{
    public UserUpdateTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task Update_User()
    {
        // First create a user
        var (createRsp, createRes) = await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, UserCreateResponse>(
            new()
            {
                Username = "updateuser",
                Email = "update@example.com",
                Password = "Password123!",
                FirstName = "Update",
                LastName = "User",
                IsActive = true
            });

        // Then update the user
        var (updateRsp, updateRes) = await App.Client.PUTAsync<UserUpdateEndpoint, UserUpdateRequest, UserUpdateResponse>(
            new()
            {
                Id = createRes.Id,
                Username = "updateuser_modified",
                Email = "update_modified@example.com",
                FirstName = "Updated",
                LastName = "UserModified",
                IsActive = false
            });

        updateRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        updateRes.Username.Should().Be("updateuser_modified");
        updateRes.Email.Should().Be("update_modified@example.com");
        updateRes.FirstName.Should().Be("Updated");
        updateRes.LastName.Should().Be("UserModified");
        updateRes.IsActive.Should().BeFalse();
    }

    [Fact]
    public async Task Update_NonExistent_User()
    {
        var (updateRsp, _) = await App.Client.PUTAsync<UserUpdateEndpoint, UserUpdateRequest, UserUpdateResponse>(
            new()
            {
                Id = Guid.NewGuid(),
                Username = "nonexistent",
                Email = "nonexistent@example.com",
                FirstName = "Non",
                LastName = "Existent",
                IsActive = true
            });

        updateRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}