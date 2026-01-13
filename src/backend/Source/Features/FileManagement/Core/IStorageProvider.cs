namespace Backend.Features.FileManagement.Core;

using Backend.Attributes;

[AllowOutside]
public interface IStorageProvider
{
    Task<string> SaveAsync(Stream stream, string fileName, string contentType);
    Task<Stream?> GetAsync(string fileName);
    Task DeleteAsync(string fileName);
    bool Exists(string fileName);
}
