using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Tests.Seeder;

public class TestsDataSeeder(IUserService userService, IRoleService roleService, IPermissionService permissionService)
{
    public async Task SeedAsync()
    {
        var permissions = await permissionService.Permissions().ToListAsync();

        await CreateUserWithRole(permissions, UserConst.Test, RoleConst.Test);
        await CreateUserWithRole(permissions, UserConst.TestOne, RoleConst.TestOne);
        await CreateUserWithRole(permissions, UserConst.TestTwo, RoleConst.TestTwo);
    }

    private async Task CreateUserWithRole(List<Permission> permissions, string username, string roleName)
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
    }
}
