namespace Backend.Features.FileManagement.Core;

using Backend.Attributes;
using Microsoft.AspNetCore.StaticFiles;

[NoDirectUse]
public class LocalFileService(IWebHostEnvironment webHostEnvironment) : IFileService
{
    private readonly string _storagePath = Path.Combine(webHostEnvironment.ContentRootPath, "uploads");

    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType)
    {
        if (!Directory.Exists(_storagePath))
        {
            Directory.CreateDirectory(_storagePath);
        }

        var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";
        var path = Path.Combine(_storagePath, uniqueFileName);
        await using var fileStream = new FileStream(path, FileMode.Create);
        await stream.CopyToAsync(fileStream);
        return uniqueFileName;
    }

    public Task<FileDownloadResult?> DownloadAsync(string fileName)
    {
        var path = Path.Combine(_storagePath, fileName);
        if (!File.Exists(path))
        {
            return Task.FromResult<FileDownloadResult?>(null);
        }

        var memory = new MemoryStream();
        using (var stream = new FileStream(path, FileMode.Open))
        {
            stream.CopyTo(memory);
        }
        memory.Position = 0;

        return Task.FromResult<FileDownloadResult?>(new FileDownloadResult
        {
            Content = memory,
            ContentType = GetContentType(path)
        });
    }

    public Task DeleteAsync(string fileName)
    {
        var path = Path.Combine(_storagePath, fileName);
        if (File.Exists(path))
        {
            File.Delete(path);
        }
        return Task.CompletedTask;
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