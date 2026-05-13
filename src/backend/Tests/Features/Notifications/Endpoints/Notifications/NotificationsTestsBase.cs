namespace Backend.Tests.Features.Notifications.Endpoints.Notifications;

using Backend.Data;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using Backend.Features.Notifications.Core;
using Backend.Features.Notifications.Core.Entities;

public abstract class NotificationsTestsBase(App app) : AppTestsBase(app)
{
    protected AppDbContext DbContext => App.Services.GetRequiredService<AppDbContext>();

    protected async Task<User> CreateAdminUserAsync(string username, string password)
    {
        var userService = App.Services.GetRequiredService<IUserService>();
        var roleService = App.Services.GetRequiredService<IRoleService>();
        var user = await userService.GetByUsernameAsync(username);
        if (user == null)
        {
            user = await userService.CreateAsync(new User
            {
                Default = true,
                Username = username,
                Email = $"{username}@example.com"
            }, password);
            user.NormalizeProperties();
            // Assign admin role to the user
            var adminRole = await roleService.GetByNameAsync("Admin");
            if (adminRole == null)
            {
                throw new Exception("Admin role does not exist. Please ensure it is created before running the tests.");
            }
            await userService.AssignRoleAsync(user.Id, adminRole.Id);
            return user;
        }
        else
            throw new Exception($"Admin user ({username}) already exists. Please choose a different username.");
    }

    protected async Task<Notification> CreateUserNotificationAsync(Guid userId, NotificationType type = NotificationType.Info)
    {
        var notification = new Notification
        {
            UserId = userId,
            Type = type,
            TitleKey = $"test.title.{Guid.NewGuid()}",
            MessageKey = $"test.message.{Guid.NewGuid()}",
            IsRead = false
        };
        DbContext.Notifications.Add(notification);
        await DbContext.SaveChangesAsync();
        return notification;
    }

    protected async Task<Notification> CreateGlobalNotificationAsync(NotificationType type = NotificationType.Info)
    {
        var notification = new Notification
        {
            UserId = null,
            Type = type,
            TitleKey = $"test.title.global.{Guid.NewGuid()}",
            MessageKey = $"test.message.global.{Guid.NewGuid()}",
            IsRead = false
        };
        DbContext.Notifications.Add(notification);
        await DbContext.SaveChangesAsync();
        return notification;
    }

    protected async Task MarkNotificationVisitedAsync(Guid notificationId, Guid userId)
    {
        var visit = new NotificationVisit
        {
            NotificationId = notificationId,
            UserId = userId,
            VisitedAt = DateTime.UtcNow
        };
        DbContext.NotificationVisits.Add(visit);
        await DbContext.SaveChangesAsync();
    }

    protected async Task<Guid> GetCurrentUserIdAsync()
    {
        var userService = App.Services.GetRequiredService<IUserService>();
        var user = await userService.GetByUsernameAsync("admin");
        return user!.Id;
    }

    protected async Task<Guid> GetTestUserIdAsync()
    {
        return await DbContext.Users
            .Where(x => x.Username == UserConst.Test)
            .Select(x => x.Id)
            .SingleAsync();
    }
}
