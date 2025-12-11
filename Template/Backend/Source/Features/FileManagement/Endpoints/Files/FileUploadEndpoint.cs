namespace Backend.Features.FileManagement.Endpoints.Files;

using Backend.Features.FileManagement.Core;

public class FileUploadEndpoint(IFileStatusService fileStatusService, IFileService fileService) : Endpoint<FileUploadRequest, FileUploadResponse>
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

        await fileStatusService.CreateAsync(fileName);

        var response = new FileUploadResponse
        {
            FileName = fileName
        };

        return response;
    }
}

public class FileUploadRequest
{
    public IFormFile? File { get; set; }
}

public class FileUploadValidator : Validator<FileUploadRequest>
{
    public FileUploadValidator()
    {
        RuleFor(x => x.File).NotEmpty();
    }
}

public class FileUploadResponse
{
    public string FileName { get; set; } = null!;
}
