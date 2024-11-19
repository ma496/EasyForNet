using Backend.Auth;
using Backend.Data.Entities.Identity;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class DataSeeder
{
    private readonly IUserService _userService;
    private readonly IRoleService _roleService;
    private readonly IPermissionService _permissionService;
    private readonly IPermissionDefinitionService _permissionDefinitionService;

    public DataSeeder(IUserService userService, IRoleService roleService, IPermissionService permissionService, IPermissionDefinitionService permissionDefinitionService)
    {
        _userService = userService;
        _roleService = roleService;
        _permissionService = permissionService;
        _permissionDefinitionService = permissionDefinitionService;
    }

    public async Task SeedAsync()
    {
        var flattenedPermissions = _permissionDefinitionService.GetFlattenedPermissions();
        var savedPermissions = await _permissionService.Permissions().ToListAsync();
        var permissionsToAdd = flattenedPermissions.Where(p => !savedPermissions.Any(sp => sp.Name == p.Name)).ToList();
        var permissionsToUpdate = flattenedPermissions.Where(p => savedPermissions.Any(sp => sp.Name == p.Name && sp.DisplayName != p.DisplayName)).ToList();
        foreach (var permission in permissionsToAdd)
        {
            await _permissionService.CreateAsync(new Permission { Name = permission.Name, DisplayName = permission.DisplayName });
        }
        foreach (var permission in permissionsToUpdate)
        {
            var savedPermission = savedPermissions.FirstOrDefault(sp => sp.Name == permission.Name);
            if (savedPermission != null)
            {
                savedPermission.DisplayName = permission.DisplayName;
                await _permissionService.UpdateAsync(savedPermission);
            }
        }
        var permissions = await _permissionService.Permissions().ToListAsync();

        var adminRole = await _roleService.GetByNameAsync("Admin") ??
            await _roleService.CreateAsync(new Role { Name = "Admin" });
        var adminPermissions = await _permissionService.GetRolePermissionsAsync(adminRole.Id);
        var adminPermissionsToAssign = permissions.Where(p => !adminPermissions.Any(ap => ap.Name == p.Name)).ToList();
        foreach (var permission in adminPermissionsToAssign)
        {
            await _roleService.AssignPermissionAsync(adminRole.Id, permission.Id);
        }

        var adminUser = await _userService.GetByUsernameAsync("admin") ??
            await _userService.CreateAsync(new User { Username = "admin", Email = "admin@example.com" }, "Admin#123");
        if (!await _userService.IsInRoleAsync(adminUser.Id, adminRole.Id))
        {
            await _userService.AssignRoleAsync(adminUser.Id, adminRole.Id);
        }
    }
}
