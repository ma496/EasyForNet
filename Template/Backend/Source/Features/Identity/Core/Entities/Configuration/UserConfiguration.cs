namespace Backend.Features.Identity.Core.Entities.Configuration;

using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users", "identity");

        builder.HasIndex(u => u.UsernameNormalized)
            .IsUnique();
        builder.HasIndex(u => u.EmailNormalized)
            .IsUnique();
    }
}