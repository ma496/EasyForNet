using Backend;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Endpoints.Roles;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace Tests.Features.Identity.Endpoints.Roles;

public class ChangePermissionsTests : AppTestsBase
{
    private readonly ITestOutputHelper _output;

    public ChangePermissionsTests(App app, ITestOutputHelper output) : base(app)
    {
        SetAuthToken().Wait();
        _output = output;
    }

    [Fact]
    public async Task Change_Permissions()
    {
        var roleService = App.Services.GetRequiredService<IRoleService>();
        var permissionService = App.Services.GetRequiredService<IPermissionService>();
        var permissions = await permissionService.Permissions().Take(2).Select(x => x.Id).ToListAsync();
        var role = await roleService.CreateAsync(new()
        {
            Name = $"TestRole_{Helper.UniqueNumber()}",
            Description = "Test Role"
        });

        var (rsp, res) = await App.Client.PUTAsync<ChangePermissionsEndpoint, ChangePermissionsRequest, ChangePermissionsResponse>(
            new()
            {
                Id = role.Id,
                Permissions = permissions
            });

        rsp.StatusCode.Should().Be(HttpStatusCode.OK);
        res.Permissions.Should().Equal(permissions);
    }

    [Fact]
    public async Task Change_Permissions_Of_Role_Already_Has_Permissions()
    {
        var roleService = App.Services.GetRequiredService<IRoleService>();
        var permissionService = App.Services.GetRequiredService<IPermissionService>();
        var permissions = await permissionService.Permissions().Take(2).Select(x => x.Id).ToListAsync();
        var role = await roleService.CreateAsync(new()
        {
            Name = $"TestRole_{Helper.UniqueNumber()}",
            Description = "Test Role"
        });
        var (rsp, res) = await App.Client.PUTAsync<ChangePermissionsEndpoint, ChangePermissionsRequest, ChangePermissionsResponse>(
           new()
           {
               Id = role.Id,
               Permissions = permissions
           });

        var newPermissions = await permissionService.Permissions().Skip(2).Take(2).Select(x => x.Id).ToListAsync();
        var mixPermissions = new List<Guid> { permissions[0] };
        mixPermissions.AddRange(newPermissions);

        var (rsp1, res1) = await App.Client.PUTAsync<ChangePermissionsEndpoint, ChangePermissionsRequest, ChangePermissionsResponse>(
            new()
            {
                Id = role.Id,
                Permissions = mixPermissions
            });

        rsp1.StatusCode.Should().Be(HttpStatusCode.OK);
        res1.Permissions.Should().Equal(mixPermissions);
    }
}