namespace Backend.Features.Notifications.Core.Entities;

using Backend.Data.Entities.Base;

public class NotificationVisit : BaseEntity<Guid>
{
    public Guid UserId { get; set; }
    public DateTime VisitedAt { get; set; }

    public Guid NotificationId { get; set; }
    public Notification Notification { get; set; } = null!;
}