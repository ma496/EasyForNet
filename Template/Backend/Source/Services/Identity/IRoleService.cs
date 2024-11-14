using Backend.Data.Entities.Identity;

namespace Backend.Services.Identity;

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
