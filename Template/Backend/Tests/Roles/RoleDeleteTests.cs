using Backend.Features.Roles;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Tests.Roles;

public class RoleDeleteTests : AppTestsBase
{
    public RoleDeleteTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task Delete_Role()
    {
        var permissionService = App.Services.GetRequiredService<IPermissionService>();
        var permissions = await permissionService.Permissions().Take(2).Select(x => x.Id).ToListAsync();

        // First create a role
        RoleCreateRequest request = new()
        {
            Name = "DeleteRole",
            Description = "Delete Role Description",
            Permissions = permissions
        };
        var (createRsp, createRes) = await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, RoleCreateResponse>(request);

        createRsp.StatusCode.Should().Be(HttpStatusCode.OK);

        // Then delete the role
        var (deleteRsp, deleteRes) = await App.Client.DELETEAsync<RoleDeleteEndpoint, RoleDeleteRequest, RoleDeleteResponse>(
            new()
            {
                Id = createRes.Id
            });

        deleteRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        deleteRes.Success.Should().BeTrue();

        // Verify the role is deleted by trying to get it
        var (getRsp, _) = await App.Client.GETAsync<RoleGetEndpoint, RoleGetRequest, RoleGetResponse>(
            new()
            {
                Id = createRes.Id
            });

        getRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_NonExistent_Role()
    {
        var (deleteRsp, _) = await App.Client.DELETEAsync<RoleDeleteEndpoint, RoleDeleteRequest, RoleDeleteResponse>(
            new()
            {
                Id = Guid.NewGuid()
            });

        deleteRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_Default_Role()
    {
        // Get a default role (Test role from seeder)
        var roleService = App.Services.GetRequiredService<IRoleService>();
        var defaultRole = await roleService.GetByNameAsync("Test");
        defaultRole.Should().NotBeNull();

        // Try to delete the default role
        var (deleteRsp, res) = await App.Client.DELETEAsync<RoleDeleteEndpoint, RoleDeleteRequest, ProblemDetails>(
            new()
            {
                Id = defaultRole!.Id
            });

        deleteRsp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        res.Errors.Should().ContainSingle();
        res.Errors.First().Reason.Should().Be("Default role can not be deleted.");
    }
}