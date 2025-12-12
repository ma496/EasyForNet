namespace Backend.Tests.Features.Identity.Endpoints.Roles;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using Backend.Features.Identity.Endpoints.Roles;

public class ChangePermissionsTests(App app) : AppTestsBase(app)
{
    [Fact]
    public async Task Change_Permissions()
    {
        await SetAuthTokenAsync();

        var roleService = App.Services.GetRequiredService<IRoleService>();
        var permissionService = App.Services.GetRequiredService<IPermissionService>();
        var permissions = await permissionService
                                .Permissions()
                                .Take(2)
                                .Select(x => x.Id)
                                .ToListAsync(cancellationToken: TestContext.Current.CancellationToken);
        var faker = new Faker<Role>()
            .RuleFor(u => u.Name, f => f.Internet.UserName() + f.UniqueIndex)
            .RuleFor(u => u.Description, f => f.Lorem.Sentence());
        var role = await roleService.CreateAsync(faker.Generate());

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
        await SetAuthTokenAsync();

        var roleService = App.Services.GetRequiredService<IRoleService>();
        var permissionService = App.Services.GetRequiredService<IPermissionService>();
        var permissions = await permissionService
                                .Permissions()
                                .Take(2)
                                .Select(x => x.Id)
                                .ToListAsync(cancellationToken: TestContext.Current.CancellationToken);
        var faker = new Faker<Role>()
            .RuleFor(u => u.Name, f => f.Internet.UserName() + f.UniqueIndex)
            .RuleFor(u => u.Description, f => f.Lorem.Sentence());
        var role = await roleService.CreateAsync(faker.Generate());
        var (rsp, res) = await App.Client.PUTAsync<ChangePermissionsEndpoint, ChangePermissionsRequest, ChangePermissionsResponse>(
           new()
           {
               Id = role.Id,
               Permissions = permissions
           });

        var newPermissions = await permissionService
                                   .Permissions()
                                   .Skip(2)
                                   .Take(2)
                                   .Select(x => x.Id)
                                   .ToListAsync(cancellationToken: TestContext.Current.CancellationToken);
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