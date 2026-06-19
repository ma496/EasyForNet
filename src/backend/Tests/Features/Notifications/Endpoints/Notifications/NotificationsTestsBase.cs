namespace Backend.Tests.Features.Notifications.Endpoints.Notifications;

using Backend.Features.Notifications.Core;
using Backend.Features.Notifications.Core.Entities;

/// <summary>
/// Base class for notification endpoint tests providing helper methods for creating test notifications.
/// </summary>
public abstract class NotificationsTestsBase(App app) : AppTestsBase(app)
{
    /// <summary>
    /// Creates a user-specific notification with the given user ID and type.
    /// </summary>
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

    /// <summary>
    /// Creates a global notification (no specific user) with the given type.
    /// </summary>
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

    /// <summary>
    /// Records a visit for a notification by a specific user, used for testing global notification read tracking.
    /// </summary>
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
