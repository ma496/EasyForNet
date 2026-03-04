namespace Backend.Data;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using Backend.Permissions;

public class DataSeeder(IUserService userService,
                        IRoleService roleService,
                        IPermissionService permissionService,
                        IPermissionDefinitionService permissionDefinitionService)
{
    public async Task SeedAsync()
    {
        var flattenedPermissions = permissionDefinitionService.GetFlattenedPermissions();
        var savedPermissions = await permissionService.Permissions().AsNoTracking().ToListAsync();
        var permissionsToAdd = flattenedPermissions.Where(p => !savedPermissions.Any(sp => sp.Name == p.Name)).ToList();
        var permissionsToUpdate = flattenedPermissions.Where(p => savedPermissions.Any(sp => sp.Name == p.Name && sp.DisplayName != p.DisplayName)).ToList();
        var permissionsToDelete = savedPermissions.Where(sp => flattenedPermissions.All(p => p.Name != sp.Name)).ToList();

        await permissionService.CreateAsync([.. permissionsToAdd.Select(p => new Permission { Name = p.Name, DisplayName = p.DisplayName })]);
        foreach (var permission in permissionsToUpdate)
        {
            var savedPermission = savedPermissions.FirstOrDefault(sp => sp.Name == permission.Name);
            if (savedPermission != null)
            {
                savedPermission.DisplayName = permission.DisplayName;
                await permissionService.UpdateAsync(savedPermission);
            }
        }
        await permissionService.RemovePermissionsFromAllRoles([.. permissionsToDelete.Select(p => p.Id)]);
        await permissionService.DeleteAsync([.. permissionsToDelete.Select(p => p.Id)]);

        // all permissions
        var permissions = await permissionService.Permissions().AsNoTracking().ToListAsync();

        // admin role
        var adminRole = await roleService.GetByNameAsync("Admin") ??
            await roleService.CreateAsync(new Role { Default = true, Name = "Admin", Description = "Admin Role" });
        var adminPermissions = await permissionService.GetRolePermissionsAsync(adminRole.Id);
        var adminPermissionsToAssign = permissions.Where(p => adminPermissions.All(ap => ap.Name != p.Name)).ToList();
        await roleService.AssignPermissionsAsync(adminRole.Id, [.. adminPermissionsToAssign.Select(p => p.Id)]);
        var adminPermissionsToRemove = adminPermissions.Where(ap => permissions.All(p => p.Name != ap.Name)).ToList();
        await roleService.RemovePermissionsAsync(adminRole.Id, [.. adminPermissionsToRemove.Select(p => p.Id)]);

        // admin user
        var adminUser = await userService.GetByUsernameAsync("admin") ??
            await userService.CreateAsync(new User { Default = true, Username = "admin", Email = "admin@example.com", IsEmailVerified = true }, "Admin#123");
        if (!await userService.IsInRoleAsync(adminUser.Id, adminRole.Id))
        {
            await userService.AssignRoleAsync(adminUser.Id, adminRole.Id);
        }
    }
}
