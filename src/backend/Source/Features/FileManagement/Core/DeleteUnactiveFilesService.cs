namespace Backend.Features.FileManagement.Core;

using Backend.Attributes;

[AllowOutside]
public interface IDeleteUnactiveFilesService
{
    Task DeleteAsync();
}

[NoDirectUse]
public class DeleteUnactiveFilesService(AppDbContext dbContext, IOptions<FileSetting> fileSettingOpt,
    IFileService fileService, IFileStatusService fileStatusService) : IDeleteUnactiveFilesService
{
    public async Task DeleteAsync()
    {
        var fileSetting = fileSettingOpt.Value;
        var thresholdDate = DateTime.UtcNow.AddHours(-fileSetting.DeleteUnactiveFilesTime);

        var unactiveFiles = await dbContext.UploadFiles
            .AsNoTracking()
            .Where(x => x.Status == FileStatus.Inactive && x.CreatedAt < thresholdDate)
            .Select(x => x.Name)
            .ToListAsync();

        if (unactiveFiles.Count == 0) return;

        foreach (var fileName in unactiveFiles)
        {
            await fileService.DeleteAsync(fileName);
        }

        await fileStatusService.DeleteAsync(unactiveFiles);
    }
}