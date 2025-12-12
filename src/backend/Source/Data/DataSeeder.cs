namespace Backend.Data;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;

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

        await permissionService.CreateAsync(permissionsToAdd.Select(p => new Permission { Name = p.Name, DisplayName = p.DisplayName }).ToList());
        foreach (var permission in permissionsToUpdate)
        {
            var savedPermission = savedPermissions.FirstOrDefault(sp => sp.Name == permission.Name);
            if (savedPermission != null)
            {
                savedPermission.DisplayName = permission.DisplayName;
                await permissionService.UpdateAsync(savedPermission);
            }
        }
        await permissionService.RemovePermissionsFromAllRoles(permissionsToDelete.Select(p => p.Id).ToList());
        await permissionService.DeleteAsync(permissionsToDelete.Select(p => p.Id).ToList());

        // all permissions
        var permissions = await permissionService.Permissions().AsNoTracking().ToListAsync();

        // admin role
        var adminRole = await roleService.GetByNameAsync("Admin") ??
            await roleService.CreateAsync(new Role { Default = true, Name = "Admin", Description = "Admin Role" });
        var adminPermissions = await permissionService.GetRolePermissionsAsync(adminRole.Id);
        var adminPermissionsToAssign = permissions.Where(p => adminPermissions.All(ap => ap.Name != p.Name)).ToList();
        foreach (var permission in adminPermissionsToAssign)
        {
            await roleService.AssignPermissionAsync(adminRole.Id, permission.Id);
        }
        var adminPermissionsToRemove = adminPermissions.Where(ap => permissions.All(p => p.Name != ap.Name)).ToList();
        foreach (var permission in adminPermissionsToRemove)
        {
            await roleService.RemovePermissionAsync(adminRole.Id, permission.Id);
        }

        // admin user
        var adminUser = await userService.GetByUsernameAsync("admin") ??
            await userService.CreateAsync(new User { Default = true, Username = "admin", Email = "admin@example.com" }, "Admin#123");
        if (!await userService.IsInRoleAsync(adminUser.Id, adminRole.Id))
        {
            await userService.AssignRoleAsync(adminUser.Id, adminRole.Id);
        }

        // public user permissions
        string[] publicPermissions = [];
        var loadPublicPermissions = permissions
            .Where(p => publicPermissions.Contains(p.Name))
            .ToList();

        // public user role
        var publicUserRole = await roleService.GetByNameAsync("Public") ??
            await roleService.CreateAsync(new Role { Default = true, Name = "Public", Description = "Public User Role" });
        var publicUserPermissions = await permissionService.GetRolePermissionsAsync(publicUserRole.Id);
        var publicUserPermissionsToAssign = loadPublicPermissions.Where(p => publicUserPermissions.All(up => up.Name != p.Name)).ToList();
        foreach (var permission in publicUserPermissionsToAssign)
        {
            await roleService.AssignPermissionAsync(publicUserRole.Id, permission.Id);
        }
        var publicUserPermissionsToRemove = publicUserPermissions.Where(up => loadPublicPermissions.All(p => p.Name != up.Name)).ToList();
        foreach (var permission in publicUserPermissionsToRemove)
        {
            await roleService.RemovePermissionAsync(publicUserRole.Id, permission.Id);
        }

        // public user
        var publicUser = await userService.GetByUsernameAsync("public") ??
            await userService.CreateAsync(new User { Default = true, Username = "public", Email = "public@example.com" }, "Public#123");
        if (!await userService.IsInRoleAsync(publicUser.Id, publicUserRole.Id))
        {
            await userService.AssignRoleAsync(publicUser.Id, publicUserRole.Id);
        }
    }
}
