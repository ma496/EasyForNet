using System.Text.Json;
using FastEndpointsTool.Parsing;

namespace FastEndpointsTool.Generator;

public class InitGenerator : CodeGeneratorBase<InitArgument>
{
    public override async Task Generate(InitArgument argument)
    {
        var (isInitialized, directory) = await IsInitialized(Directory.GetCurrentDirectory());
        if (isInitialized)
            throw new UserFriendlyException($"fetool.json already exists in {directory}");
        if (directory == null)
            throw new UserFriendlyException("Failed to find .sln file in directory or any parent directory.");

        var rootNamespace = argument.RootNamespace ?? argument.ProjectName;
        var feToolConfig = new FeToolSetting
        {
            Project = new()
            {
                Directory = argument.Directory,
                Name = argument.ProjectName,
                EndpointPath = "Features",
                RootNamespace = rootNamespace,
                PermissionsNamespace = $"{rootNamespace}.Auth",
                SortingColumn = "CreatedAt",
                AllowClassPath = "Auth/Allow.cs",
                DtoMappings =
                [
                    new()
                    {
                        Entity = "Backend.Data.Entities.Base.BaseEntity",
                        Dto = "Backend.Features.Base.Dto.BaseDto"
                    },

                    new()
                    {
                        Entity = "Backend.Data.Entities.Base.CreatableEntity",
                        Dto = "Backend.Features.Base.Dto.CreatableDto"
                    },

                    new()
                    {
                        Entity = "Backend.Data.Entities.Base.UpdatableEntity",
                        Dto = "Backend.Features.Base.Dto.UpdatableDto"
                    },

                    new()
                    {
                        Entity = "Backend.Data.Entities.Base.AuditableEntity",
                        Dto = "Backend.Features.Base.Dto.AuditableDto"
                    }
                ],
                Endpoints = new()
                {
                    ListEndpoint = new()
                    {
                        RequestBaseType = "Template.Backend.Source.Features.Base.Dto.ListRequestDto",
                        ResponseBaseType = "Template.Backend.Features.Base.Dto.ListDto",
                        ProcessMethod = "Backend.Extensions.Process"
                    }
                }
            }
        };

        var feToolJson = JsonSerializer.Serialize(feToolConfig, new JsonSerializerOptions
        {
            WriteIndented = true
        });
        await File.WriteAllTextAsync(Path.Combine(directory, "fetool.json"), feToolJson);
        Console.WriteLine($"fetool.json created successfully in {directory}");
    }

    public static async Task<(bool isInitialized, string? directory)> IsInitialized(string? directory = null)
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
