using Backend.Features.Users;

namespace Tests.Users;

public class UserUpdateTests : AppTestsBase
{
    public UserUpdateTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task Update_User()
    {
        UserCreateRequest request = new()
        {
            Username = "updateuser",
            Email = "update@example.com",
            Password = "Password123!",
            FirstName = "Update",
            LastName = "User",
            IsActive = true
        };
        var (createRsp, createRes) = await App.Client.POSTAsync<UserCreateEndpoint, UserCreateRequest, UserCreateResponse>(request);

        createRsp.StatusCode.Should().Be(HttpStatusCode.OK);

        UserUpdateRequest updateRequest = new()
        {
            Id = createRes.Id,
            Username = "updateuser_modified",
            Email = "update_modified@example.com",
            FirstName = "Updated",
            LastName = "UserModified",
            IsActive = false
        };
        var (updateRsp, updateRes) = await App.Client.PUTAsync<UserUpdateEndpoint, UserUpdateRequest, UserUpdateResponse>(updateRequest);

        updateRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        updateRes.Username.Should().Be(updateRequest.Username);
        updateRes.Email.Should().Be(updateRequest.Email);
        updateRes.FirstName.Should().Be(updateRequest.FirstName);
        updateRes.LastName.Should().Be(updateRequest.LastName);
        updateRes.IsActive.Should().Be(updateRequest.IsActive);
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