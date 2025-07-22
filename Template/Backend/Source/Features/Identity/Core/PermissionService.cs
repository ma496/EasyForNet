using Backend.Data;
using Backend.Features.Identity.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Identity.Core;

public interface IPermissionService
{
    Task<Permission?> GetByIdAsync(Guid id);
    Task<Permission?> GetByNameAsync(string name);
    IQueryable<Permission> Permissions();
    Task<Permission> CreateAsync(Permission permission);
    Task UpdateAsync(Permission permission);
    Task DeleteAsync(Guid id);
    Task DeleteAsync(Permission permission);
    Task<List<Permission>> GetRolePermissionsAsync(Guid roleId);
    Task<List<Permission>> GetUserPermissionsAsync(Guid userId);
}

public class PermissionService(AppDbContext dbContext) : IPermissionService
{
    public async Task<Permission?> GetByIdAsync(Guid id)
    {
        return await dbContext.Permissions.FindAsync(id);
    }

    public async Task<Permission?> GetByNameAsync(string name)
    {
        return await dbContext.Permissions.FirstOrDefaultAsync(p => p.Name == name);
    }

    public IQueryable<Permission> Permissions()
    {
        return dbContext.Permissions;
    }

    public async Task<Permission> CreateAsync(Permission permission)
    {
        dbContext.Permissions.Add(permission);
        await dbContext.SaveChangesAsync();
        return permission;
    }

    public async Task UpdateAsync(Permission permission)
    {
        dbContext.Permissions.Update(permission);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var permission = await GetByIdAsync(id);
        if (permission != null)
        {
            await DeleteAsync(permission);
        }
    }

    public async Task DeleteAsync(Permission permission)
    {
        dbContext.Permissions.Remove(permission);
        await dbContext.SaveChangesAsync();
    }

    public async Task<List<Permission>> GetRolePermissionsAsync(Guid roleId)
    {
        return await dbContext.RolePermissions
            .Where(rp => rp.RoleId == roleId)
            .Select(rp => rp.Permission)
            .ToListAsync();
    }

    public async Task<List<Permission>> GetUserPermissionsAsync(Guid userId)
    {
        return await dbContext.UserRoles
            .Where(ur => ur.UserId == userId)
            .SelectMany(ur => ur.Role.RolePermissions)
            .Select(rp => rp.Permission)
            .Distinct()
            .ToListAsync();
    }
} 