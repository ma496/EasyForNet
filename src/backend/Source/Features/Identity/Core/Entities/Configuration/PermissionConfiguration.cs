namespace Backend.Features.Identity.Core.Entities.Configuration;

using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> builder)
    {
        builder.ToTable("Permissions", "identity");

        builder.HasIndex(p => p.Name)
            .IsUnique();
    }
}
