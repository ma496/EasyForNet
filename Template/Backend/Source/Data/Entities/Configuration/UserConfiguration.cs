using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Backend.Data.Entities.Identity;

namespace Backend.Data.Entities.Configuration;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasIndex(u => u.UsernameNormalized)
            .IsUnique();
        builder.HasIndex(u => u.EmailNormalized)
            .IsUnique();
    }
}