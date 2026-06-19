namespace Backend.Features.Notifications.Core.Entities.Configuration;

using Backend.Features.Notifications.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

/// <summary>
/// EF Core entity configuration for <see cref="NotificationVisit"/>. Maps the entity to the
/// "NotificationVisits" table in the "notifications" schema and defines a unique composite index
/// on (NotificationId, UserId) and a secondary index on (UserId, VisitedAt) for fast read-state lookups.
/// </summary>
public class NotificationVisitConfiguration : IEntityTypeConfiguration<NotificationVisit>
{
    public void Configure(EntityTypeBuilder<NotificationVisit> builder)
    {
        builder.ToTable("NotificationVisits", "notifications");

        builder.HasKey(x => x.Id);

        builder.HasIndex(x => new { x.NotificationId, x.UserId }).IsUnique();
        builder.HasIndex(x => new { x.UserId, x.VisitedAt });

        builder.HasOne(x => x.Notification)
               .WithMany(x => x.Visits)
               .HasForeignKey(x => x.NotificationId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}