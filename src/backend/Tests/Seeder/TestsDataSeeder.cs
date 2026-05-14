namespace Backend.Tests.Seeder;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;

public class TestsDataSeeder(IUserService userService, IRoleService roleService, IPermissionService permissionService)
{
    public async Task SeedAsync(HttpClient _)
    {
        var permissions = await permissionService.Permissions().ToListAsync();

        var (testUserId, testRoleId) = await CreateUserWithRole(permissions, "test", "Test");
        var (testOneUserId, testOneRoleId) = await CreateUserWithRole(permissions, "testone", "TestOne");
        var (testTwoUserId, testTwoRoleId) = await CreateUserWithRole(permissions, "testtwo", "TestTwo");

        var adminUserId = await userService.GetByUsernameAsync("admin") is User adminUser ? adminUser.Id : Guid.Empty;
        var adminRoleId = await roleService.GetByNameAsync("Admin") is Role adminRole ? adminRole.Id : Guid.Empty;
        TestUsers.SetUserIds(adminUserId, testUserId, testOneUserId, testTwoUserId);
        TestRoles.SetRoleIds(adminRoleId, testRoleId, testOneRoleId, testTwoRoleId);
    }

    private async Task<(Guid userId, Guid roleId)> CreateUserWithRole(List<Permission> permissions, string username, string roleName)
    {
        var role = await roleService.GetByNameAsync(roleName) ??
            await roleService.CreateAsync(new Role { Default = true, Name = roleName });
        var rolePermissions = await permissionService.GetRolePermissionsAsync(role.Id);
        var permissionsToAssign = permissions.Where(p => !rolePermissions.Any(rp => rp.Name == p.Name)).ToList();
        foreach (var permission in permissionsToAssign)
        {
            await roleService.AssignPermissionAsync(role.Id, permission.Id);
        }

        var user = await userService.GetByUsernameAsync(username) ??
            await userService.CreateAsync(new User { Default = true, Username = username, Email = $"{username}@example.com" }, "Test#123");
        if (!await userService.IsInRoleAsync(user.Id, role.Id))
        {
            await userService.AssignRoleAsync(user.Id, role.Id);
        }
        return (user.Id, role.Id);
    }
}
