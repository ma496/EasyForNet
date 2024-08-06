using FastEndpointsTool.Parsing;
using System.Reflection;
using System.Text.Json;

namespace FastEndpointsTool.Generator;

public abstract class CodeGeneratorBase<TArgument>
    where TArgument : Argument
{
    public abstract Task Generate(TArgument argument);

    protected string GetEndpointDir(string projectDir, string endpointPath, string output)
    {
        var endpointDir = Path.Combine(projectDir, endpointPath, output ?? string.Empty);
        return endpointDir;
    }

    protected string? GetClassNamespace(string projectDir, string projectName, string className)
    {
        var assembly = GetProjectAssembly(projectDir, projectName);
        var types = assembly.GetTypes()
            .Where(t => t.Name == className)
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

    protected Assembly GetProjectAssembly(string projectDir, string projectName)
    {
        var assemblyPath = Path.Combine(projectDir, "bin", "Debug", "net8.0", $"{projectName}.dll");
        var loadedAssembly = Assembly.LoadFrom(assemblyPath);

        return loadedAssembly;
    }

    protected async Task<(FeToolSetting setting, string path)> GetSetting(string? directory = null)
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

    protected string GetEndpointNamespace(string rootNamespace, string endpointPath, string output)
    {
        return $"{rootNamespace}.{endpointPath}" + (string.IsNullOrWhiteSpace(output) ? string.Empty : $".{output}");
    }
}
