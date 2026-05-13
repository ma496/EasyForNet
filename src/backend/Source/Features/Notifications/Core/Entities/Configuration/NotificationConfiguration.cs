namespace Backend.Features.Notifications.Core.Entities.Configuration;

using Backend.Features.Notifications.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

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
