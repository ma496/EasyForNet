namespace Backend.Features.Identity.Core.Entities.Configuration;

using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles", "identity");

        builder.HasIndex(r => r.NameNormalized)
            .IsUnique();
    }
}
