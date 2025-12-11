using Backend.Attributes;

﻿namespace Backend.Features.FileManagement.Core;    

[AllowOutside]
public interface IFileService
{
    Task<string> UploadAsync(Stream stream, string fileName, string contentType);
    Task<FileDownloadResult?> DownloadAsync(string fileName);
    Task DeleteAsync(string fileName);
}

[AllowOutside]
public class FileDownloadResult
{
    public Stream Content { get; set; } = Stream.Null;
    public string ContentType { get; set; } = string.Empty;
}