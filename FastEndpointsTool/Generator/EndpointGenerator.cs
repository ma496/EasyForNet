using FastEndpointsTool.Extensions;
using FastEndpointsTool.Parsing;
using System.Text;

namespace FastEndpointsTool.Generator;

public class EndpointGenerator : CodeGeneratorBase<EndpointArgument>
{
    public override async Task Generate(EndpointArgument argument)
    {
        var directory = Directory.GetCurrentDirectory();
        var (setting, dir) = await GetSetting(directory);
        var fileName = $"{argument.Name}Endpoint.cs";
        var projectDir = Path.Combine(dir, setting.Project.Name);
        var endpointDir = GetEndpointDir(projectDir, setting.Project.EndpointPath, argument.Output);
        if (!Directory.Exists(endpointDir))
            Directory.CreateDirectory(endpointDir);
        var filePath = Path.Combine(endpointDir, fileName);

        var templatePath = Path.Combine(directory, $"Templates/{argument.Type}.txt");
        if (!File.Exists(templatePath))
            throw new Exception($"{templatePath} not found.");
        var templateText = await File.ReadAllTextAsync(templatePath);
        var templateBuilder = new StringBuilder();

        var namespaces = new List<string?>
        {
            GetClassNamespace(projectDir, setting.Project.Name, argument.Entity),
            GetClassNamespace(projectDir, setting.Project.Name, argument.Group)
        };
        var endpointNamespace = GetEndpointNamespace(setting.Project.RootNamespace, setting.Project.EndpointPath, argument.Output);
        var uniqueNamespaces = namespaces
            .Where(x => !string.IsNullOrWhiteSpace(x) && x != endpointNamespace)
            .Distinct()
            .ToList();
        var lastNamespaceIndex = uniqueNamespaces.Count - 1;
        var currentNamespaceIndex = 0;
        uniqueNamespaces.ForEach(x =>
        {
            templateBuilder.AppendLine($"using {x};{(currentNamespaceIndex == lastNamespaceIndex ? Environment.NewLine : "")}");
            currentNamespaceIndex++;
        });

        templateBuilder.AppendLine($"namespace {endpointNamespace};");
        templateBuilder.AppendLine();
        templateBuilder.AppendLine(templateText);
        templateBuilder.Replace("${Name}", argument.Name);
        templateBuilder.Replace("${HttpMethod}", argument.Method.ToPascalCase());
        templateBuilder.Replace("${Url}", argument.Url);
        templateBuilder.Replace("${Entity}", argument.Entity);
        templateBuilder.Replace("${Group}", argument.Group);
        var template = templateBuilder.ToString();

        await File.WriteAllTextAsync(filePath, template);

        Console.WriteLine($"{fileName} file created under {endpointDir}");
    }
}
