using FastEndpointsTool.Extensions;
using System.Reflection;
using System.Text;
using System.Text.Json;

namespace FastEndpointsTool;

public class CodeGenerator
{
    public async Task Generate(string[] args)
    {
        var argument = new Parser().Parse(args);

        if (argument is EndpointArgument endpointArgument)
        {
            var directory = Directory.GetCurrentDirectory();
            var (setting, dir) = await GetSetting(directory);
            var fileName = $"{endpointArgument.Name}Endpoint.cs";
            var projectDir = Path.Combine(dir, setting.Project.Name);
            var endpointDir = GetEndpointDir(projectDir, setting.Project.EndpointPath, endpointArgument.Output);
            if (!Directory.Exists(endpointDir))
                Directory.CreateDirectory(endpointDir);
            var filePath = Path.Combine(endpointDir, fileName);

            var txt = await File.ReadAllTextAsync(Path.Combine(directory, "Templates/Endpoint.txt"));
            var templateBuilder = new StringBuilder();
            var entityClassNamespace = GetEntityClassNamespace(projectDir, setting.Project.Name, endpointArgument.Entity);
            if (!string.IsNullOrWhiteSpace(entityClassNamespace))
                templateBuilder.AppendLine($"using {entityClassNamespace};{Environment.NewLine}");
            templateBuilder.AppendLine($"namespace {GetEndpointNamespace(setting.Project.RootNamespace, setting.Project.EndpointPath, endpointArgument.Output)};");
            templateBuilder.AppendLine();
            templateBuilder.AppendLine(txt);
            templateBuilder.Replace("${Name}", endpointArgument.Name);
            templateBuilder.Replace("${HttpMethod}", endpointArgument.Method.ToPascalCase());
            templateBuilder.Replace("${Url}", endpointArgument.Url);
            templateBuilder.Replace("${Entity}", endpointArgument.Entity);
            var template = templateBuilder.ToString();

            await File.WriteAllTextAsync(filePath, template);

            Console.WriteLine($"{fileName} file created under {endpointDir}");
        }
        else
            throw new Exception("Invalid args.");
    }

    

    #region Helpers

    private static string GetEndpointDir(string projectDir, string endpointPath, string output)
    {
        return Path.Combine(projectDir, endpointPath, output ?? string.Empty);
    }

    private string? GetEntityClassNamespace(string projectDir, string projectName, string entity)
    {
        var assembly = GetProjectAssembly(projectDir, projectName);
        var types = assembly.GetTypes()
            .Where(t => t.Name == entity)
            .ToArray();

        if (types.Length == 0) return null;
        if (types.Length == 1) return types[0].Namespace;
        Console.WriteLine("Multiple types found.");
        var index = 0;
        foreach (var t in types)
        {
            Console.WriteLine($"{t.FullName}: Type {index} then enter");
            index++;
        }
        var indexStr = Console.ReadLine();
        var isInteger = int.TryParse(indexStr, out var selectIndex);
        if (!isInteger)
            throw new Exception("input is not integer.");
        if (selectIndex >= 0 && selectIndex < index)
            return types[selectIndex].Namespace;
        throw new Exception("input number out of range");
    }

    private Assembly GetProjectAssembly(string projectDir, string projectName)
    {
#if DEBUG
        var config = "Debug";
#else
        var config = "Release";
#endif

        var assemblyPath = Path.Combine(projectDir, "bin", config, "net8.0", $"{projectName}.dll");
        var loadedAssembly = Assembly.LoadFrom(assemblyPath);

        return loadedAssembly;
    }

    private async Task<(FeToolSetting setting, string path)> GetSetting(string? directory = null)
    {
        if (string.IsNullOrWhiteSpace(directory))
            throw new Exception("No fetool.json file found.");

        var dirInfo = new DirectoryInfo(directory);
        var path = Path.Combine(directory, "fetool.json");
        if (File.Exists(path))
        {
            var json = await File.ReadAllTextAsync(path);
            var setting = JsonSerializer.Deserialize<FeToolSetting>(json);
            if (setting == null)
                throw new Exception("Invalid fetool.json");
            setting.Validate();
            return (setting, directory);
        }
        else
        {
            return await GetSetting(dirInfo.Parent?.FullName);
        }
    }

    private string GetEndpointNamespace(string rootNamespace, string endpointPath, string output)
    {
        return $"{rootNamespace}.{endpointPath}" + (string.IsNullOrWhiteSpace(output) ? string.Empty : $".{output}");
    }

    #endregion
}
