using Backend.Data.Entities;
using Microsoft.AspNetCore.Identity;

namespace Backend.Data;

public class DataSeed
{
    private readonly AppDbContext _dbContext;
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<AppRole> _roleManager;

    public DataSeed(AppDbContext dbContext, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _roleManager = roleManager;
    }   

    public async Task SeedAsync()
    {
        // create roles if they don't exist
        var roles = new[] { "Admin", "User" };
        foreach (var role in roles)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new AppRole { Name = role });
            }
        }

        // create admin user with Admin role if it doesn't exist
        var adminUsername = "admin";
        var adminUser = await _userManager.FindByNameAsync(adminUsername);
        if (adminUser == null)
        {
            adminUser = new AppUser { UserName = adminUsername, Email = "admin@example.com" };
            var adminResult = await _userManager.CreateAsync(adminUser, "Admin#123");
            if (adminResult.Succeeded)
            {
                await _userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        // create regular user with User role if it doesn't exist
        var username = "user";
        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            user = new AppUser { UserName = username, Email = "user@example.com" };
            var userResult = await _userManager.CreateAsync(user, "User#123");
            if (userResult.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
            }
        }
    }
}
