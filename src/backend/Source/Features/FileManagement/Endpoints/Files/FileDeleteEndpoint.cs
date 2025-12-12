namespace Backend.Features.FileManagement.Endpoints.Files;

using Backend.Features.FileManagement.Core;

public class FileDeleteEndpoint(IFileService fileService) : Endpoint<FileDeleteRequest>
{
    public override void Configure()
    {
        Delete("{fileName}");
        Group<FileGroup>();
    }

    public override async Task HandleAsync(FileDeleteRequest req, CancellationToken ct)
    {
        await fileService.DeleteAsync(req.FileName);
        await Send.NoContentAsync(ct);
    }
}

public class FileDeleteRequest
{
    public string FileName { get; set; } = null!;
}

public class FileDeleteRequestValidator : Validator<FileDeleteRequest>
{
    public FileDeleteRequestValidator()
    {
        RuleFor(x => x.FileName).NotEmpty();
    }
}
