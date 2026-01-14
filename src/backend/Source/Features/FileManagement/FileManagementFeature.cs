namespace Backend.Features.FileManagement;

using Backend.Attributes;
using Backend.Features.FileManagement.Core;

[BypassNoDirectUse]
public class FileManagementFeature : IFeature
{
    public static void AddServices(IServiceCollection services, ConfigurationManager configuration)
    {
        // configure services
        services.AddScoped<IStorageProvider, LocalStorageProvider>();
        services.AddScoped<IFileService, FileService>();
    }
}
