namespace Backend.Features.FileManagement.Core;

using Backend.Attributes;
using Microsoft.AspNetCore.StaticFiles;

/// <summary>
/// Application-level service for uploading, downloading, and deleting files. Acts as a
/// thin coordinator over an <see cref="IStorageProvider"/>, adding concerns such as
/// unique filename generation.
/// </summary>
[AllowOutside]
public interface IFileService
{
    /// <summary>
    /// Persists the supplied stream and returns a unique filename under which it was saved.
    /// </summary>
    /// <param name="stream">The content to upload.</param>
    /// <param name="fileName">The original filename, used to derive the stored file's extension.</param>
    /// <param name="contentType">The MIME content type of the uploaded file.</param>
    /// <returns>The unique filename assigned to the stored file.</returns>
    Task<string> UploadAsync(Stream stream, string fileName, string contentType);

    /// <summary>
    /// Retrieves a previously stored file as a stream along with its content type, or
    /// <c>null</c> if no file with the given name exists.
    /// </summary>
    /// <param name="fileName">The unique filename returned from a prior upload.</param>
    Task<FileDownloadResult?> DownloadAsync(string fileName);

    /// <summary>
    /// Removes the file with the given name from storage, if present.
    /// </summary>
    /// <param name="fileName">The unique filename of the file to delete.</param>
    Task DeleteAsync(string fileName);
}

/// <summary>
/// Default <see cref="IFileService"/> implementation that delegates persistence to an
/// <see cref="IStorageProvider"/> and generates a unique filename on upload.
/// </summary>
[NoDirectUse]
public class FileService(IStorageProvider storageProvider) : IFileService
{
    /// <summary>
    /// Generates a unique filename based on a GUID plus the original extension and
    /// delegates persistence to the storage provider.
    /// </summary>
    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType)
    {
        var extension = Path.GetExtension(fileName);
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";

        await storageProvider.SaveAsync(stream, uniqueFileName, contentType);

        return uniqueFileName;
    }

    /// <summary>
    /// Retrieves the file's content stream and resolves its content type from the
    /// filename, returning <c>null</c> when the file does not exist.
    /// </summary>
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

    /// <summary>
    /// Deletes the file with the given name from the underlying storage provider.
    /// </summary>
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

/// <summary>
/// Result of a successful file download, bundling the file's content stream with its
/// MIME type for return to the caller.
/// </summary>
[AllowOutside]
public class FileDownloadResult
{
    public Stream Content { get; set; } = Stream.Null;
    public string ContentType { get; set; } = string.Empty;
}