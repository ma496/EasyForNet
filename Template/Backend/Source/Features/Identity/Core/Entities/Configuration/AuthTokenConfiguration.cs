namespace Backend.Features.Identity.Core.Entities.Configuration;

using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class AuthTokenConfiguration : IEntityTypeConfiguration<AuthToken>
{
    public void Configure(EntityTypeBuilder<AuthToken> builder)
    {
        builder.ToTable("AuthTokens", "identity");

        builder.HasOne(at => at.User)
            .WithMany(u => u.AuthTokens)
            .HasForeignKey(at => at.UserId);
    }
}
