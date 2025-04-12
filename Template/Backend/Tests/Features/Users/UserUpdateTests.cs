using Backend;
using Backend.Features.Users;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;
using Tests.Seeder;

namespace Tests.Features.Users;

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
            Username = $"updateuser{Helper.UniqueNumber()}",
            Email = $"update{Helper.UniqueNumber()}@example.com",
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
            Email = $"update_modified{Helper.UniqueNumber()}@example.com",
            FirstName = "Updated",
            LastName = "UserModified",
            IsActive = false,
            Roles = [(await roleService.GetByNameAsync(RoleConst.TestOne))!.Id, (await roleService.GetByNameAsync(RoleConst.TestTwo))!.Id]
        };
        var (updateRsp, updateRes) = await App.Client.PUTAsync<UserUpdateEndpoint, UserUpdateRequest, UserUpdateResponse>(updateRequest);

        updateRsp.StatusCode.Should().Be(HttpStatusCode.OK);
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
                Email = "nonexistent@example.com",
                FirstName = "Non",
                LastName = "Existent",
                IsActive = true
            });

        updateRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Update_Admin_User_Should_Fail()
    {
        // Get the default user
        var defaultUser = await App.Services.GetRequiredService<IUserService>()
            .Users()
            .FirstAsync(u => u.Username == "admin");

        var roleService = App.Services.GetRequiredService<IRoleService>();
        var (updateRsp, res) = await App.Client.PUTAsync<UserUpdateEndpoint, UserUpdateRequest, ProblemDetails>(
            new()
            {
                Id = defaultUser.Id,
                Email = "modified_default@example.com",
                FirstName = "Modified",
                LastName = "Default",
                IsActive = false,
                Roles = [(await roleService.GetByNameAsync(RoleConst.Test))!.Id]
            });

        updateRsp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        res.Errors.Should().ContainSingle();
        res.Errors.First().Reason.Should().Be("default_user_cannot_be_updated");
    }
}