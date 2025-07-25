using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Tests.Seeder;

public class TestsDataSeeder
{
    private readonly IUserService _userService;
    private readonly IRoleService _roleService;
    private readonly IPermissionService _permissionService;

    public TestsDataSeeder(IUserService userService, IRoleService roleService, IPermissionService permissionService)
    {
        _userService = userService;
        _roleService = roleService;
        _permissionService = permissionService;
    }

    public async Task SeedAsync()
    {
        var permissions = await _permissionService.Permissions().ToListAsync();

        await CreateUserWithRole(permissions, UserConst.Test, RoleConst.Test);
        await CreateUserWithRole(permissions, UserConst.TestOne, RoleConst.TestOne);
        await CreateUserWithRole(permissions, UserConst.TestTwo, RoleConst.TestTwo);
    }

    private async Task CreateUserWithRole(List<Permission> permissions, string username, string roleName)
    {
        var role = await _roleService.GetByNameAsync(roleName) ??
            await _roleService.CreateAsync(new Role { Default = true, Name = roleName });
        var rolePermissions = await _permissionService.GetRolePermissionsAsync(role.Id);
        var permissionsToAssign = permissions.Where(p => !rolePermissions.Any(rp => rp.Name == p.Name)).ToList();
        foreach (var permission in permissionsToAssign)
        {
            await _roleService.AssignPermissionAsync(role.Id, permission.Id);
        }

        var user = await _userService.GetByUsernameAsync(username) ??
            await _userService.CreateAsync(new User { Default = true, Username = username, Email = $"{username}@example.com" }, "Test#123");
        if (!await _userService.IsInRoleAsync(user.Id, role.Id))
        {
            await _userService.AssignRoleAsync(user.Id, role.Id);
        }
    }
}
