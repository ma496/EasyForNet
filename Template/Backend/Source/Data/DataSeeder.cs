using Backend.Data.Entities.Identity;
using Backend.Services.Identity;

namespace Backend.Data;

public class DataSeeder
{
    private readonly IUserService _userService;
    private readonly IRoleService _roleService;

    public DataSeeder(IUserService userService, IRoleService roleService)
    {
        _userService = userService;
        _roleService = roleService;
    }

    public async Task SeedAsync()
    {
        var adminRole = await _roleService.GetByNameAsync("Admin") ?? 
            await _roleService.CreateAsync(new Role { Name = "Admin" });
        var adminUser = await _userService.GetByUsernameAsync("admin") ??
            await _userService.CreateAsync(new User { Username = "admin", Email = "admin@example.com" }, "Admin#123");

        if (!await _userService.IsInRoleAsync(adminUser.Id, adminRole.Id))
        {
            await _userService.AssignRoleAsync(adminUser.Id, adminRole.Id);
        }

        var userRole = await _roleService.GetByNameAsync("User") ??
            await _roleService.CreateAsync(new Role { Name = "User" });
        var user = await _userService.GetByUsernameAsync("user") ??
            await _userService.CreateAsync(new User { Username = "user", Email = "user@example.com" }, "User#123");

        if (!await _userService.IsInRoleAsync(user.Id, userRole.Id))
        {
            await _userService.AssignRoleAsync(user.Id, userRole.Id);
        }
    }
}
