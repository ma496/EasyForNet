using Backend.Attributes;
using Backend.Data;
using Backend.Features.Identity.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Identity.Core;

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

[NoDirectUse]
public class UserService(AppDbContext dbContext, IPasswordHasher passwordHasher) : IUserService
{
    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await dbContext.Users.FindAsync(id);
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await dbContext.Users.FirstOrDefaultAsync(u => u.UsernameNormalized == username.ToLowerInvariant());
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await dbContext.Users.FirstOrDefaultAsync(u => u.EmailNormalized == email.ToLowerInvariant());
    }

    public IQueryable<User> Users()
    {
        return dbContext.Users;
    }

    public async Task<User> CreateAsync(User user, string password)
    {
        user.PasswordHash = passwordHasher.HashPassword(password);
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();
        return user;
    }

    public async Task UpdateAsync(User user)
    {
        dbContext.Users.Update(user);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var user = await GetByIdAsync(id);
        if (user != null)
        {
            dbContext.Users.Remove(user);
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(User user)
    {
        dbContext.Users.Remove(user);
        await dbContext.SaveChangesAsync();
    }

    public async Task<bool> ValidatePasswordAsync(User user, string password)
    {
        return await Task.FromResult(user.PasswordHash == passwordHasher.HashPassword(password));
    }

    public async Task<List<string>> GetUserRolesAsync(Guid userId)
    {
        return await dbContext.UserRoles
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.Role.Name)
            .ToListAsync();
    }

    public async Task<List<string>> GetUserPermissionsAsync(Guid userId)
    {
        return await dbContext.UserRoles
            .Where(ur => ur.UserId == userId)
            .SelectMany(ur => ur.Role.RolePermissions)
            .Select(rp => rp.Permission.Name)
            .Distinct()
            .ToListAsync();
    }

    public async Task AssignRoleAsync(Guid userId, Guid roleId)
    {
        var userRole = new UserRole { UserId = userId, RoleId = roleId };
        dbContext.UserRoles.Add(userRole);
        await dbContext.SaveChangesAsync();
    }

    public async Task RemoveRoleAsync(Guid userId, Guid roleId)
    {
        var userRole = await dbContext.UserRoles
            .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId);
        if (userRole != null)
        {
            dbContext.UserRoles.Remove(userRole);
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task<bool> IsInRoleAsync(Guid userId, Guid roleId)
    {
        return await dbContext.UserRoles.AnyAsync(ur => ur.UserId == userId && ur.RoleId == roleId);
    }

    public async Task<User> UpdatePasswordAsync(User user, string password)
    {
        user.PasswordHash = passwordHasher.HashPassword(password);
        await UpdateAsync(user);
        return user;
    }

    public async Task UpdateLastLoginAsync(Guid userId)
    {
        await dbContext.Users
            .Where(u => u.Id == userId)
            .ExecuteUpdateAsync(set => set.SetProperty(u => u.LastLoginAt, DateTime.UtcNow));
    }
}