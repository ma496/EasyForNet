using Backend.Features.Notifications.Core.Entities;

namespace Backend.Features.Notifications.Core;

public interface INotificationService
{
    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default);
    Task NewUserNotificationAsync(Guid userId, NotificationType type, string titleKey, string messageKey, string? group = null, string? metadata = null, CancellationToken cancellationToken = default);
    Task NewGlobalNotificationAsync(NotificationType type, string titleKey, string messageKey, string? group = null, string? metadata = null, CancellationToken cancellationToken = default);   
}

public class NotificationService(AppDbContext dbContext) : INotificationService
{
    public async Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var visitedNotificationIds = await dbContext.NotificationVisits
            .Where(v => v.UserId == userId)
            .Select(v => v.NotificationId)
            .ToListAsync(cancellationToken);

        var newCount = await dbContext.Notifications
            .CountAsync(x =>
                (x.UserId == userId && !x.IsRead) ||
                (x.UserId == null && !visitedNotificationIds.Contains(x.Id)),
                cancellationToken);
        return newCount;
    }

    public async Task NewUserNotificationAsync(Guid userId, NotificationType type, string titleKey, string messageKey, string? group = null, string? metadata = null, CancellationToken cancellationToken = default)
    {
        var notification = new Notification
        {
            UserId = userId,
            Type = type,
            TitleKey = titleKey,
            MessageKey = messageKey,
            Group = group,
            Metadata = metadata
        };

        dbContext.Notifications.Add(notification);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task NewGlobalNotificationAsync(NotificationType type, string titleKey, string messageKey, string? group = null, string? metadata = null, CancellationToken cancellationToken = default)
    {
        var notification = new Notification
        {
            UserId = null,
            Type = type,
            TitleKey = titleKey,
            MessageKey = messageKey,
            Group = group,
            Metadata = metadata
        };

        dbContext.Notifications.Add(notification);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}