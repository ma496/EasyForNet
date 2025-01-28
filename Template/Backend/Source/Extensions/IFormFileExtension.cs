namespace Backend.Extensions;

public static class IFormFileExtension
{
    public static async Task<byte[]> GetBytesAsync(this IFormFile file, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
            throw new InvalidOperationException("File is null or empty");

        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream, cancellationToken);
        return memoryStream.ToArray();
    }
}
