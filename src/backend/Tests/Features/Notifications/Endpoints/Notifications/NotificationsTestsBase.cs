namespace Backend.Tests.Features.Notifications.Endpoints.Notifications;

using Backend.Features.Notifications.Core;
using Backend.Features.Notifications.Core.Entities;

public abstract class NotificationsTestsBase(App app) : AppTestsBase(app)
{
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
}
