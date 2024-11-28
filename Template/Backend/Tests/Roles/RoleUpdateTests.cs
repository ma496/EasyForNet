using Backend.Features.Roles;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Tests.Roles;

public class RoleUpdateTests : AppTestsBase
{
    public RoleUpdateTests(App app) : base(app)
    {
        SetAuthToken().Wait();
    }

    [Fact]
    public async Task Update_Role()
    {
        var permissionService = App.Services.GetRequiredService<IPermissionService>();
        var permissions = await permissionService.Permissions().Take(2).Select(x => x.Id).ToListAsync();

        RoleCreateRequest request = new()
        {
            Name = "UpdateRole",
            Description = "Update Role Description",
            Permissions = permissions
        };
        var (createRsp, createRes) = await App.Client.POSTAsync<RoleCreateEndpoint, RoleCreateRequest, RoleCreateResponse>(request);

        createRsp.StatusCode.Should().Be(HttpStatusCode.OK);

        var newPermissions = await permissionService.Permissions().Skip(2).Take(2).Select(x => x.Id).ToListAsync();
        RoleUpdateRequest updateRequest = new()
        {
            Id = createRes.Id,
            Name = "UpdateRole_Modified",
            Description = "Update Role Description Modified",
            Permissions = newPermissions
        };
        var (updateRsp, updateRes) = await App.Client.PUTAsync<RoleUpdateEndpoint, RoleUpdateRequest, RoleUpdateResponse>(updateRequest);

        updateRsp.StatusCode.Should().Be(HttpStatusCode.OK);
        updateRes.Name.Should().Be(updateRequest.Name);
        updateRes.Description.Should().Be(updateRequest.Description);
        updateRes.Permissions.Should().Equal(updateRequest.Permissions);
    }

    [Fact]
    public async Task Update_NonExistent_Role()
    {
        var permissionService = App.Services.GetRequiredService<IPermissionService>();
        var permissions = await permissionService.Permissions().Take(2).Select(x => x.Id).ToListAsync();

        var (updateRsp, _) = await App.Client.PUTAsync<RoleUpdateEndpoint, RoleUpdateRequest, RoleUpdateResponse>(
            new()
            {
                Id = Guid.NewGuid(),
                Name = "NonExistent",
                Description = "Non Existent Role",
                Permissions = permissions
            });

        updateRsp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Update_Default_Role_Should_Fail()
    {
        var permissionService = App.Services.GetRequiredService<IPermissionService>();
        var permissions = await permissionService.Permissions().Take(2).Select(x => x.Id).ToListAsync();

        // Get the default role ID - assuming you have a way to identify it
        var defaultRole = await App.Services.GetRequiredService<IRoleService>()
            .Roles()
            .FirstAsync(r => r.Default);

        var (updateRsp, res) = await App.Client.PUTAsync<RoleUpdateEndpoint, RoleUpdateRequest, ProblemDetails>(
            new()
            {
                Id = defaultRole.Id,
                Name = "Modified Default Role",
                Description = "Attempt to modify default role",
                Permissions = permissions
            });

        updateRsp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        res.Errors.Should().ContainSingle();
        res.Errors.First().Reason.Should().Be("Default role can not be updated.");
    }
}