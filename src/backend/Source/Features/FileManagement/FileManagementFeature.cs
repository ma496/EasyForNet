namespace Backend.Features.FileManagement;

using Backend.Attributes;
using Backend.Features.FileManagement.Core;

[BypassNoDirectUse]
public class FileManagementFeature : IFeature
{
    public static void AddServices(IServiceCollection services, ConfigurationManager configuration)
    {
        // configure settings
        services.Configure<FileSetting>(configuration.GetSection("File"));

        // configure services
        services.AddScoped<IFileStatusService, FileStatusService>();
        services.AddScoped<IDeleteUnactiveFilesService, DeleteUnactiveFilesService>();
        services.AddScoped<IFileService, LocalFileService>();
    }
}
