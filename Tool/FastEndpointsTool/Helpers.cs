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
            return (setting, Path.Combine(directory, setting.Project.Directory, setting.Project.Name));
        }
        else
        {
            return await GetSetting(dirInfo.Parent?.FullName);
        }
    }

    public static string EndpointName(string name, EndpointType type)
    {
        if (type == EndpointType.CreateEndpoint && !name.EndsWith("Create"))
            return $"{name}Create";
        if (type == EndpointType.UpdateEndpoint && !name.EndsWith("Update"))
            return $"{name}Update";
        if (type == EndpointType.GetEndpoint && !name.EndsWith("Get"))
            return $"{name}Get";
        if (type == EndpointType.ListEndpoint && !name.EndsWith("List"))
            return $"{name}List";
        if (type == EndpointType.DeleteEndpoint && !name.EndsWith("Delete"))
            return $"{name}Delete";

        return name;
    }

    public static string GroupName(string group)
    {
        return group.EndsWith("Group") ? group : $"{group}Group";
    }
}
