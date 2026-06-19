namespace Backend.Features.Identity.Core.Entities.Configuration;

using Microsoft.EntityFrameworkCore.Metadata.Builders;

/// <summary>
/// EF Core entity configuration for <see cref="Role"/>, mapping it to the <c>identity.Roles</c> table
/// and enforcing a unique index on the normalized role name.
/// </summary>
public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    /// <summary>
    /// Configures the table mapping, schema, and indexes on the role name and normalized role name.
    /// </summary>
    /// <param name="builder">The builder used to configure the <see cref="Role"/> entity type.</param>
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles", "identity");

        builder.HasIndex(r => r.Name)
            .IsUnique(false);
        builder.HasIndex(r => r.NameNormalized)
            .IsUnique();
    }
}
