namespace Backend.Features.FileManagement.Endpoints.Files;

using Backend.Features.FileManagement.Core;

public class FileGetEndpoint(IFileService fileService) : Endpoint<FileGetRequest>
{
    public override void Configure()
    {
        Get("{fileName}");
        Group<FileGroup>();
    }

    public override async Task HandleAsync(FileGetRequest req, CancellationToken ct)
    {
        var result = await fileService.DownloadAsync(req.FileName);
        if (result is null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        await Send.StreamAsync(result.Content, contentType: result.ContentType, cancellation: ct);
    }
}

public class FileGetRequest
{
    public string FileName { get; set; } = null!;
}

public class FileGetValidation : Validator<FileGetRequest>
{
    public FileGetValidation()
    {
        RuleFor(x => x.FileName).NotEmpty();
    }
}
