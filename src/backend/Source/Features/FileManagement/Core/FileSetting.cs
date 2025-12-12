namespace Backend.Features.FileManagement.Core;

using Backend.Attributes;

[AllowOutside]
public class FileSetting
{
    // delete unactive files time in hours
    public int DeleteUnactiveFilesTime { get; set; } = 24;
}