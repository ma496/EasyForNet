using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using Backend.Permissions;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class DataSeeder(IUserService userService,
                        IRoleService roleService,
                        IPermissionService permissionService,
                        IPermissionDefinitionService permissionDefinitionService)
{
    public async Task SeedAsync()
    {
        var flattenedPermissions = permissionDefinitionService.GetFlattenedPermissions();
        var savedPermissions = await permissionService.Permissions().ToListAsync();
        var permissionsToAdd = flattenedPermissions.Where(p => !savedPermissions.Any(sp => sp.Name == p.Name)).ToList();
        var permissionsToUpdate = flattenedPermissions.Where(p => savedPermissions.Any(sp => sp.Name == p.Name && sp.DisplayName != p.DisplayName)).ToList();
        foreach (var permission in permissionsToAdd)
        {
            await permissionService.CreateAsync(new Permission { Name = permission.Name, DisplayName = permission.DisplayName });
        }
        foreach (var permission in permissionsToUpdate)
        {
            var savedPermission = savedPermissions.FirstOrDefault(sp => sp.Name == permission.Name);
            if (savedPermission != null)
            {
                savedPermission.DisplayName = permission.DisplayName;
                await permissionService.UpdateAsync(savedPermission);
            }
        }
        var permissions = await permissionService.Permissions().ToListAsync();

        var adminRole = await roleService.GetByNameAsync("Admin") ??
            await roleService.CreateAsync(new Role { Default = true, Name = "Admin", Description = "Admin Role" });
        var adminPermissions = await permissionService.GetRolePermissionsAsync(adminRole.Id);
        var adminPermissionsToAssign = permissions.Where(p => adminPermissions.All(ap => ap.Name != p.Name)).ToList();
        foreach (var permission in adminPermissionsToAssign)
        {
            await roleService.AssignPermissionAsync(adminRole.Id, permission.Id);
        }

        var adminUser = await userService.GetByUsernameAsync("admin") ??
            await userService.CreateAsync(new User { Default = true, Username = "admin", Email = "admin@example.com" }, "Admin#123");
        if (!await userService.IsInRoleAsync(adminUser.Id, adminRole.Id))
        {
            await userService.AssignRoleAsync(adminUser.Id, adminRole.Id);
        }
    }
}
