namespace Backend.Features.FileManagement.Core.Entities.Configuration;

using Backend.Features.FileManagement.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class UploadFileConfiguration : IEntityTypeConfiguration<UploadFile>
{
    public void Configure(EntityTypeBuilder<UploadFile> builder)
    {
        builder.ToTable("UploadFiles", "file-management");

        builder.Property(x => x.Status)
            .HasConversion<string>();

        builder.HasIndex(x => x.Name).IsUnique();
    }
}