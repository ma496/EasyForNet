namespace Backend.Features.FileManagement.Core;

using Backend.Attributes;

/// <summary>
/// <see cref="IStorageProvider"/> implementation that stores files on the local
/// filesystem under an <c>uploads</c> folder inside the web host's content root.
/// </summary>
[NoDirectUse]
public class LocalStorageProvider(IWebHostEnvironment webHostEnvironment) : IStorageProvider
{
    private readonly string _storagePath = Path.Combine(webHostEnvironment.ContentRootPath, "uploads");

    /// <summary>
    /// Creates the uploads directory on disk if it does not already exist.
    /// </summary>
    private void EnsureDirectoryExists()
    {
        if (!Directory.Exists(_storagePath))
        {
            Directory.CreateDirectory(_storagePath);
        }
    }

    /// <summary>
    /// Writes the supplied stream to a file in the uploads directory, creating the
    /// directory if needed, and returns the stored filename.
    /// </summary>
    public async Task<string> SaveAsync(Stream stream, string fileName, string contentType)
    {
        EnsureDirectoryExists();
        var path = Path.Combine(_storagePath, fileName);
        await using var fileStream = new FileStream(path, FileMode.Create);
        await stream.CopyToAsync(fileStream);
        return fileName;
    }

    /// <summary>
    /// Opens a read-only file stream for the requested filename, or returns
    /// <c>null</c> when the file does not exist on disk.
    /// </summary>
    public Task<Stream?> GetAsync(string fileName)
    {
        var path = Path.Combine(_storagePath, fileName);
        if (!File.Exists(path))
        {
            return Task.FromResult<Stream?>(null);
        }

        return Task.FromResult<Stream?>(new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read));
    }

    /// <summary>
    /// Removes the file from disk if it exists; no-op when the file is already absent.
    /// </summary>
    public Task DeleteAsync(string fileName)
    {
        var path = Path.Combine(_storagePath, fileName);
        if (File.Exists(path))
        {
            File.Delete(path);
        }
        return Task.CompletedTask;
    }

    /// <summary>
    /// Returns whether a file with the given name currently exists in the uploads
    /// directory.
    /// </summary>
    public bool Exists(string fileName)
    {
        var path = Path.Combine(_storagePath, fileName);
        return File.Exists(path);
    }
}
