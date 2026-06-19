namespace Backend.Features.Notifications.Core.Entities;

using Backend.Data.Entities.Base;

/// <summary>
/// Represents a notification that can be addressed to a specific user (when <see cref="UserId"/> is set)
/// or broadcast to all users (when <see cref="UserId"/> is null). Notifications are auditable and support soft deletion.
/// </summary>
public class Notification : AuditableEntity<Guid>, ISoftDelete
{
    public NotificationType Type { get; set; }
    public string TitleKey { get; set; } = null!;
    public string MessageKey { get; set; } = null!;
    // It is only applied when UserId is not null, 
    // it track the user specific read state of the notification, 
    // for global notifications this field is ignored and Visits collection should be used instead.
    public bool IsRead { get; set; } 
    public string? Group { get; set; }
    public string? Metadata { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }

    public Guid? UserId { get; set; }

    // For global notifications, we track the visits (reads) in a separate table,
    // for user-specific notifications, the IsRead field is sufficient and Visits collection is not used.
    public ICollection<NotificationVisit> Visits { get; set; } = [];
}
