namespace Backend.Features.FileManagement.Core;

using Backend.Attributes;
using Microsoft.AspNetCore.StaticFiles;

[AllowOutside]
public interface IFileService
{
    Task<string> UploadAsync(Stream stream, string fileName, string contentType);
    Task<FileDownloadResult?> DownloadAsync(string fileName);
    Task DeleteAsync(string fileName);
}

[NoDirectUse]
public class FileService(IStorageProvider storageProvider) : IFileService
{
    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType)
    {
        var extension = Path.GetExtension(fileName);
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";

        await storageProvider.SaveAsync(stream, uniqueFileName, contentType);

        return uniqueFileName;
    }

    public async Task<FileDownloadResult?> DownloadAsync(string fileName)
    {
        var stream = await storageProvider.GetAsync(fileName);
        if (stream == null)
        {
            return null;
        }

        return new FileDownloadResult
        {
            Content = stream,
            ContentType = GetContentType(fileName)
        };
    }

    public async Task DeleteAsync(string fileName)
    {
        await storageProvider.DeleteAsync(fileName);
    }

    private static string GetContentType(string path)
    {
        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(path, out var contentType))
        {
            contentType = "application/octet-stream";
        }
        return contentType;
    }
}

[AllowOutside]
public class FileDownloadResult
{
    public Stream Content { get; set; } = Stream.Null;
    public string ContentType { get; set; } = string.Empty;
}