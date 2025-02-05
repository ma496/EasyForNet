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
        
        await FetHelper.CreateFetFile(argument.Directory, argument.ProjectName,
            argument.RootNamespace ?? argument.ProjectName, Directory.GetCurrentDirectory());
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
