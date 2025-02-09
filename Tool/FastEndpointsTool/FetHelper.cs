using System.Text.Json;

namespace FastEndpointsTool;

public static class FetHelper
{
    public static async Task CreateFetFile(string projectPath, string project, string rootNamespace, string directory)
    {
        var (isInitialized, slnDirectory) = await IsInitialized(directory);
        if (isInitialized)
            throw new UserFriendlyException($"fetool.json already exists in {slnDirectory}");
        if (slnDirectory == null)
            throw new UserFriendlyException("Failed to find .sln file in directory or any parent directory.");

        var feToolConfig = new FeToolSetting
        {
            Project = new()
            {
                Directory = projectPath,
                Name = project,
                EndpointPath = "Features",
                RootNamespace = rootNamespace,
                PermissionsNamespace = $"{rootNamespace}.Auth",
                SortingColumn = "CreatedAt",
                AllowClassPath = "Auth/Allow.cs",
                PermissionDefinitionProviderPath = "Auth/PermissionDefinitionProvider.cs",
                DtoMappings =
                [
                    new()
                    {
                        Entity = $"{rootNamespace}.Data.Entities.Base.BaseEntity",
                        Dto = $"{rootNamespace}.Features.Base.Dto.BaseDto"
                    },

                    new()
                    {
                        Entity = $"{rootNamespace}.Data.Entities.Base.CreatableEntity",
                        Dto = $"{rootNamespace}.Features.Base.Dto.CreatableDto"
                    },

                    new()
                    {
                        Entity = $"{rootNamespace}.Data.Entities.Base.UpdatableEntity",
                        Dto = $"{rootNamespace}.Features.Base.Dto.UpdatableDto"
                    },

                    new()
                    {
                        Entity = $"{rootNamespace}.Data.Entities.Base.AuditableEntity",
                        Dto = $"{rootNamespace}.Features.Base.Dto.AuditableDto"
                    }
                ],
                Endpoints = new()
                {
                    ListEndpoint = new()
                    {
                        RequestBaseType = $"{rootNamespace}.Features.Base.Dto.ListRequestDto",
                        ResponseBaseType = $"{rootNamespace}.Features.Base.Dto.ListDto",
                        ProcessMethod = $"{rootNamespace}.Extensions.Process"
                    }
                }
            }
        };

        var feToolJson = JsonSerializer.Serialize(feToolConfig, new JsonSerializerOptions
        {
            WriteIndented = true
        });
        await File.WriteAllTextAsync(Path.Combine(slnDirectory, "fetool.json"), feToolJson);
        Console.WriteLine($"fetool.json created successfully in {slnDirectory}");
    }

    private static async Task<(bool isInitialized, string? directory)> IsInitialized(string? directory = null)
    {
        if (string.IsNullOrWhiteSpace(directory))
            return (false, null);

        var dirInfo = new DirectoryInfo(directory);
        var path = Path.Combine(directory, "fetool.json");
        if (File.Exists(path))
            return (true, directory);

        var slnFiles = Directory.GetFiles(directory, "*.sln");
        if (slnFiles.Any())
            return (false, directory);
        return await IsInitialized(dirInfo.Parent?.FullName);
    }
}