using Backend.Features.Notifications.Core.Entities;

namespace Backend.Features.Notifications.Core;

/// <summary>
/// Application service for creating and querying user and global notifications.
/// </summary>
public interface INotificationService
{
    /// <summary>
    /// Returns the number of unread notifications visible to the given user, considering both
    /// user-targeted notifications and unread global notifications.
    /// </summary>
    /// <param name="userId">Identifier of the user whose unread notifications are counted.</param>
    /// <param name="cancellationToken">Token used to cancel the asynchronous operation.</param>
    /// <returns>The total number of unread notifications for the user.</returns>
    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new user-targeted notification.
    /// </summary>
    /// <param name="userId">Identifier of the recipient user.</param>
    /// <param name="type">Visual/severity category of the notification.</param>
    /// <param name="titleKey">Localization key used to render the notification title.</param>
    /// <param name="messageKey">Localization key used to render the notification body.</param>
    /// <param name="group">Optional logical grouping used to filter notifications in the UI.</param>
    /// <param name="metadata">Optional opaque metadata payload (typically JSON).</param>
    /// <param name="cancellationToken">Token used to cancel the asynchronous operation.</param>
    Task NewUserNotificationAsync(Guid userId, NotificationType type, string titleKey, string messageKey, string? group = null, string? metadata = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new global (broadcast) notification visible to every user.
    /// </summary>
    /// <param name="type">Visual/severity category of the notification.</param>
    /// <param name="titleKey">Localization key used to render the notification title.</param>
    /// <param name="messageKey">Localization key used to render the notification body.</param>
    /// <param name="group">Optional logical grouping used to filter notifications in the UI.</param>
    /// <param name="metadata">Optional opaque metadata payload (typically JSON).</param>
    /// <param name="cancellationToken">Token used to cancel the asynchronous operation.</param>
    Task NewGlobalNotificationAsync(NotificationType type, string titleKey, string messageKey, string? group = null, string? metadata = null, CancellationToken cancellationToken = default);
}

/// <summary>
/// Default EF Core-backed implementation of <see cref="INotificationService"/>.
/// </summary>
public class NotificationService(AppDbContext dbContext) : INotificationService
{
    /// <summary>
    /// Counts unread notifications for the user by combining user-targeted unread rows with
    /// global notifications the user has not yet visited.
    /// </summary>
    /// <param name="userId">Identifier of the user whose unread notifications are counted.</param>
    /// <param name="cancellationToken">Token used to cancel the asynchronous operation.</param>
    /// <returns>The total number of unread notifications for the user.</returns>
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

    /// <summary>
    /// Persists a new user-targeted notification to the database.
    /// </summary>
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

    /// <summary>
    /// Persists a new global (broadcast) notification to the database.
    /// </summary>
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