namespace Backend.Features.FileManagement.Core.Entities;

using Backend.Data.Entities.Base;

public class UploadFile : AuditableEntity<Guid>
{
    public string Name { get; set; } = string.Empty;
    public long Size { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string Extension { get; set; } = string.Empty;
    public FileStatus Status { get; set; } = FileStatus.Inactive;
}
