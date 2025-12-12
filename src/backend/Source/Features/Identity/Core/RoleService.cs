namespace Backend.Features.Identity.Core;

using Backend.Attributes;
using Backend.Features.Identity.Core.Entities;

public interface IRoleService
{
    Task<Role?> GetByIdAsync(Guid id);
    Task<Role?> GetByNameAsync(string name);
    IQueryable<Role> Roles();
    Task<Role> CreateAsync(Role role);
    Task UpdateAsync(Role role);
    Task DeleteAsync(Guid id);
    Task DeleteAsync(Role role);
    Task AssignPermissionAsync(Guid roleId, Guid permissionId);
    Task RemovePermissionAsync(Guid roleId, Guid permissionId);
    Task<List<string>> GetRolePermissionsAsync(Guid roleId);
}

[NoDirectUse]
public class RoleService(AppDbContext dbContext) : IRoleService
{
    public async Task<Role?> GetByIdAsync(Guid id)
    {
        return await dbContext.Roles.FindAsync(id);
    }

    public async Task<Role?> GetByNameAsync(string name)
    {
        return await dbContext.Roles.FirstOrDefaultAsync(r => r.Name == name);
    }

    public IQueryable<Role> Roles()
    {
        return dbContext.Roles;
    }

    public async Task<Role> CreateAsync(Role role)
    {
        dbContext.Roles.Add(role);
        await dbContext.SaveChangesAsync();
        return role;
    }

    public async Task UpdateAsync(Role role)
    {
        dbContext.Roles.Update(role);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var role = await GetByIdAsync(id);
        if (role != null)
        {
            dbContext.Roles.Remove(role);
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(Role role)
    {
        dbContext.Roles.Remove(role);
        await dbContext.SaveChangesAsync();
    }

    public async Task AssignPermissionAsync(Guid roleId, Guid permissionId)
    {
        var rolePermission = new RolePermission { RoleId = roleId, PermissionId = permissionId };
        dbContext.RolePermissions.Add(rolePermission);
        await dbContext.SaveChangesAsync();
    }

    public async Task RemovePermissionAsync(Guid roleId, Guid permissionId)
    {
        var rolePermission = await dbContext.RolePermissions
            .FirstOrDefaultAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);
        if (rolePermission != null)
        {
            dbContext.RolePermissions.Remove(rolePermission);
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task<List<string>> GetRolePermissionsAsync(Guid roleId)
    {
        return await dbContext.RolePermissions
            .Where(rp => rp.RoleId == roleId)
            .Select(rp => rp.Permission.Name)
            .ToListAsync();
    }
}