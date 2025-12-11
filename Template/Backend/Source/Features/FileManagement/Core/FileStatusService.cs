namespace Backend.Features.FileManagement.Core;

using Backend.Attributes;
using Backend.Features.FileManagement.Core.Entities;

[AllowOutside]
public interface IFileStatusService
{
    Task CreateAsync(string fileName);

    Task DeleteAsync(string fileName);
    Task DeleteAsync(IReadOnlyCollection<string> fileNames);

    Task ActivateAsync(string fileName);

    Task ActivateAsync(IReadOnlyCollection<string> fileNames);
}

[NoDirectUse]
public class FileStatusService(AppDbContext dbContext) : IFileStatusService
{
    public async Task CreateAsync(string fileName)
    {
        await dbContext.UploadFiles.AddAsync(new UploadFile
        {
            Name = fileName,
            Status = FileStatus.Inactive,
        });
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(string fileName)
    {
        var uploadFile = await dbContext.UploadFiles
            .SingleOrDefaultAsync(x => x.Name == fileName);
        if (uploadFile is null)
        {
            return;
        }
        dbContext.UploadFiles.Remove(uploadFile);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(IReadOnlyCollection<string> fileNames)
    {
        await dbContext.UploadFiles
            .Where(x => fileNames.Contains(x.Name))
            .ExecuteDeleteAsync();
    }

    public async Task ActivateAsync(string fileName)
    {
        var uploadFile = await dbContext.UploadFiles
            .SingleOrDefaultAsync(x => x.Name == fileName);
        if (uploadFile is null)
        {
            return;
        }
        uploadFile.Status = FileStatus.Active;
        await dbContext.SaveChangesAsync();
    }

    public async Task ActivateAsync(IReadOnlyCollection<string> fileNames)
    {
        await dbContext.UploadFiles
            .Where(x => fileNames.Contains(x.Name))
            .ExecuteUpdateAsync(x => x.SetProperty(x => x.Status, FileStatus.Active));
    }
}