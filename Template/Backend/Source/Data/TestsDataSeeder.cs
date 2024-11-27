using Backend.Data.Entities.Identity;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

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

        await CreateUserWtithRole(permissions, "Test", "test");
        await CreateUserWtithRole(permissions, "TestOne", "testone");
        await CreateUserWtithRole(permissions, "TestTwo", "testtwo");
    }

    private async Task CreateUserWtithRole(List<Permission> permissions, string roleName, string username)
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
