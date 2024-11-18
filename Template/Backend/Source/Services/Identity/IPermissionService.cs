using Backend.Data.Entities.Identity;

namespace Backend.Services.Identity;

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