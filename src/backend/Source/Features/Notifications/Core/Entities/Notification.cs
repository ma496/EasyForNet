namespace Backend.Features.Notifications.Core.Entities;

using Backend.Data.Entities.Base;

public class Notification : AuditableEntity<Guid>, ISoftDelete
{
    public NotificationType Type { get; set; }
    public string TitleKey { get; set; } = null!;
    public string MessageKey { get; set; } = null!;
    public bool IsRead { get; set; }
    public string? Group { get; set; }
    public string? Metadata { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }

    public Guid? UserId { get; set; }

    public ICollection<NotificationVisit> Visits { get; set; } = [];
}
