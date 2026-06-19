namespace Backend.Features.Notifications.Core.Entities.Configuration;

using Backend.Features.Notifications.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

/// <summary>
/// EF Core entity configuration for <see cref="Notification"/>. Maps the entity to the
/// "Notifications" table in the "notifications" schema, stores <see cref="NotificationType"/>
/// as a string, and defines indexes for lookups by title key, message key, creation date, and user.
/// </summary>
public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("Notifications", "notifications");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Type)
               .HasConversion<string>();

        builder.HasIndex(x => x.TitleKey);
        builder.HasIndex(x => x.MessageKey);
        builder.HasIndex(x => x.CreatedAt);
        builder.HasIndex(x => x.UserId);
    }
}
