namespace EasyForNetTool.Generator;

using EasyForNetTool.Parsing;

public class CreateFeatureGenerator : CodeGeneratorBase<CreateFeatureArgument>
{
    public override async Task Generate(CreateFeatureArgument argument)
    {
        var projectPath = argument.Project ?? Directory.GetCurrentDirectory();

        var (projectName, rootNamespace) = Helpers.GetProjectInfo(projectPath);
        if (string.IsNullOrEmpty(projectName) || string.IsNullOrEmpty(rootNamespace))
        {
            throw new UserFriendlyException($"Failed to get project info from '{projectPath}'. .csproj file is not found.");
        }

        var featureName = argument.FeatureName;

        var featureDirectory = argument.Output != null
            ? Path.Combine(Directory.GetCurrentDirectory(), argument.Output, featureName)
            : Path.Combine(projectPath, "Features", featureName);

        if (Directory.Exists(featureDirectory))
        {
            throw new UserFriendlyException($"Feature '{featureName}' already exists at '{featureDirectory}'.");
        }

        // Create Directories
        Directory.CreateDirectory(featureDirectory);
        Directory.CreateDirectory(Path.Combine(featureDirectory, "Core"));
        Directory.CreateDirectory(Path.Combine(featureDirectory, "Core", "Entities"));
        Directory.CreateDirectory(Path.Combine(featureDirectory, "Core", "Entities", "Configuration"));
        Directory.CreateDirectory(Path.Combine(featureDirectory, "Endpoints"));

        var coreNamespace = $"{rootNamespace}.Features.{featureName}.Core";
        var featureNamespace = $"{rootNamespace}.Features.{featureName}";

        // Enum.cs
        var enumContent = $"namespace {coreNamespace};{Environment.NewLine}";
        await File.WriteAllTextAsync(Path.Combine(featureDirectory, "Core", "Enum.cs"), enumContent);

        // Feature File
        var featureFileContent = $@"namespace {featureNamespace};

using {rootNamespace}.Attributes;
using {coreNamespace};

[BypassNoDirectUse]
public class {featureName}Feature : IFeature
{{
    public static void AddServices(IServiceCollection services)
    {{
        
    }}
}}";
        await File.WriteAllTextAsync(Path.Combine(featureDirectory, $"{featureName}Feature.cs"), featureFileContent);

        Console.WriteLine($"Feature '{featureName}' created successfully at '{featureDirectory}'.");
    }
}
