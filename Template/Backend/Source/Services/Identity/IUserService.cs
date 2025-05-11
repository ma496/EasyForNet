using Backend.Data.Entities.Identity;

namespace Backend.Services.Identity;

public interface IUserService
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByEmailAsync(string email);
    IQueryable<User> Users();
    Task<User> CreateAsync(User user, string password);
    Task UpdateAsync(User user);
    Task DeleteAsync(Guid id);
    Task DeleteAsync(User user);
    Task<bool> ValidatePasswordAsync(User user, string password);
    Task<List<string>> GetUserRolesAsync(Guid userId);
    Task<List<string>> GetUserPermissionsAsync(Guid userId);
    Task AssignRoleAsync(Guid userId, Guid roleId);
    Task RemoveRoleAsync(Guid userId, Guid roleId);
    Task<bool> IsInRoleAsync(Guid userId, Guid roleId);
    Task<User> UpdatePasswordAsync(User user, string password);
    Task UpdateLastLoginAsync(Guid userId);
}
