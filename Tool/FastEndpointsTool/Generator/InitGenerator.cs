using System.Text.Json;
using FastEndpointsTool.Parsing;

namespace FastEndpointsTool.Generator;

public class InitGenerator : CodeGeneratorBase<InitArgument>
{
    public override async Task Generate(InitArgument argument)
    {
        var (isInitialized, directory) = await IsInitialized(Directory.GetCurrentDirectory());
        if (isInitialized)
            throw new UserFriendlyException("fetool.json already exists.");
        if (directory == null)
            throw new UserFriendlyException("Failed to find .sln directory.");

        Console.WriteLine("Creating fetool.json configuration...");
        var rootNamespace = argument.RootNamespace ?? argument.ProjectName;
        var feToolConfig = new
        {
            Project = new
            {
                Directory = argument.Directory,
                Name = argument.ProjectName,
                EndpointPath = "Features",
                RootNamespace = rootNamespace,
                PermissionsNamespace = $"{rootNamespace}.Auth",
                SortingColumn = "CreatedAt",
                AllowClassPath = "Auth/Allow.cs"
            }
        };

        var feToolJson = JsonSerializer.Serialize(feToolConfig, new JsonSerializerOptions
        {
            WriteIndented = true
        });
        await File.WriteAllTextAsync(Path.Combine(directory, "fetool.json"), feToolJson);
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
