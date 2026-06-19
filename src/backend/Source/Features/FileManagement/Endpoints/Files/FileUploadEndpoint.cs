namespace Backend.Features.FileManagement.Endpoints.Files;

using Backend.Features.FileManagement.Core;

/// <summary>
/// This endpoint exposes a POST operation accepting a multipart file upload and
/// returning the unique filename under which the file was stored.
/// </summary>
public class FileUploadEndpoint(IFileService fileService) : Endpoint<FileUploadRequest, FileUploadResponse>
{
    public override void Configure()
    {
        Post("upload");
        Group<FileGroup>();
        AllowFileUploads();
    }

    public override async Task<FileUploadResponse> ExecuteAsync(FileUploadRequest req, CancellationToken ct)
    {
        await using var stream = req.File!.OpenReadStream();
        var fileName = await fileService.UploadAsync(stream, req.File.FileName, req.File.ContentType);

        var response = new FileUploadResponse
        {
            FileName = fileName
        };

        return response;
    }
}

/// <summary>
/// Request payload for <see cref="FileUploadEndpoint"/>, containing the uploaded
/// file as a multipart form part.
/// </summary>
public class FileUploadRequest
{
    public IFormFile? File { get; set; }
}

/// <summary>
/// This validator validates the <see cref="FileUploadRequest"/>.
/// </summary>
public class FileUploadValidator : Validator<FileUploadRequest>
{
    public FileUploadValidator()
    {
        RuleFor(x => x.File).NotEmpty();
    }
}

/// <summary>
/// Response from <see cref="FileUploadEndpoint"/>, returning the unique filename
/// under which the uploaded file was stored.
/// </summary>
public class FileUploadResponse
{
    public string FileName { get; set; } = null!;
}
