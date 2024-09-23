using FastEndpointsTool.Parsing.Endpoint;
using System.Reflection;
using System.Text.Json;

namespace FastEndpointsTool;

public static class Helpers
{
    public static Assembly GetProjectAssembly(string projectDir, string projectName)
    {
        var assemblyPath = Path.Combine(projectDir, "bin", "Debug", "net8.0", $"{projectName}.dll");
        var loadedAssembly = Assembly.LoadFrom(assemblyPath);

        return loadedAssembly;
    }

    public static string GetEndpointName(string name, EndpointType type)
    {
        if (type == EndpointType.CreateEndpoint)
            return $"{name}Create";

        return name;
    }

    public static async Task<(FeToolSetting setting, string projectDir)> GetSetting(string? directory = null)
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
            return (setting, Path.Combine(directory, setting.Project.Name));
        }
        else
        {
            return await GetSetting(dirInfo.Parent?.FullName);
        }
    }
}
