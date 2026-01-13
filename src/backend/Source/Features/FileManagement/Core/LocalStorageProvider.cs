namespace Backend.Features.FileManagement.Core;

using Backend.Attributes;

[NoDirectUse]
public class LocalStorageProvider(IWebHostEnvironment webHostEnvironment) : IStorageProvider
{
    private readonly string _storagePath = Path.Combine(webHostEnvironment.ContentRootPath, "uploads");

    private void EnsureDirectoryExists()
    {
        if (!Directory.Exists(_storagePath))
        {
            Directory.CreateDirectory(_storagePath);
        }
    }

    public async Task<string> SaveAsync(Stream stream, string fileName, string contentType)
    {
        EnsureDirectoryExists();
        var path = Path.Combine(_storagePath, fileName);
        await using var fileStream = new FileStream(path, FileMode.Create);
        await stream.CopyToAsync(fileStream);
        return fileName;
    }

    public Task<Stream?> GetAsync(string fileName)
    {
        var path = Path.Combine(_storagePath, fileName);
        if (!File.Exists(path))
        {
            return Task.FromResult<Stream?>(null);
        }

        return Task.FromResult<Stream?>(new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read));
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

    public bool Exists(string fileName)
    {
        var path = Path.Combine(_storagePath, fileName);
        return File.Exists(path);
    }
}
