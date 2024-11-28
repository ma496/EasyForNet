using Backend.Features.Users;
using Backend.Services.Identity;
using Tests.Seeder;
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
        var roleService = App.Services.GetRequiredService<IRoleService>();
        UserCreateRequest request = new()
        {
            Username = "updateuser",
            Email = "update@example.com",
            Password = "Password123!",
            FirstName = "Update",
            LastName = "User",
            IsActive = true,
            Roles = [(await roleService.GetByNameAsync(RoleConst.Test))!.Id]
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
            IsActive = false,
            Roles = [(await roleService.GetByNameAsync(RoleConst.TestOne))!.Id, (await roleService.GetByNameAsync(RoleConst.TestTwo))!.Id]
        };
        var (updateRsp, updateRes) = await App.Client.PUTAsync<UserUpdateEndpoint, UserUpdateRequest, UserUpdateResponse>(updateRequest);

        updateRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        updateRes.Username.Should().Be(updateRequest.Username);
        updateRes.Email.Should().Be(updateRequest.Email);
        updateRes.FirstName.Should().Be(updateRequest.FirstName);
        updateRes.LastName.Should().Be(updateRequest.LastName);
        updateRes.IsActive.Should().Be(updateRequest.IsActive);
        updateRes.Roles.Should().Equal(updateRequest.Roles);
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