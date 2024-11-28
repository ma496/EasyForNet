using System.Reflection;
using System.Text.Json;
using System.Text.RegularExpressions;
using FastEndpointsTool.Parsing;

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
            throw new UserFriendlyException("No fetool.json file found.");

        var dirInfo = new DirectoryInfo(directory);
        var path = Path.Combine(directory, "fetool.json");
        if (File.Exists(path))
        {
            var json = await File.ReadAllTextAsync(path);
            var setting = JsonSerializer.Deserialize<FeToolSetting>(json);
            if (setting == null)
                throw new UserFriendlyException("Invalid fetool.json");
            setting.Validate();
            return (setting, Path.Combine(directory, setting.Project.Directory));
        }
        else
        {
            return await GetSetting(dirInfo.Parent?.FullName);
        }
    }

    public static string EndpointName(string name, ArgumentType type)
    {
        if (type == ArgumentType.CreateEndpoint && !name.EndsWith("Create"))
            return $"{name}Create";
        if (type == ArgumentType.UpdateEndpoint && !name.EndsWith("Update"))
            return $"{name}Update";
        if (type == ArgumentType.GetEndpoint && !name.EndsWith("Get"))
            return $"{name}Get";
        if (type == ArgumentType.ListEndpoint && !name.EndsWith("List"))
            return $"{name}List";
        if (type == ArgumentType.DeleteEndpoint && !name.EndsWith("Delete"))
            return $"{name}Delete";

        return name;
    }

    public static string GroupName(string group)
    {
        return group.EndsWith("Group") ? group : $"{group}Group";
    }

    public static string JoinUrl(params string[] parts)
    {
        return string.Join("/", parts.Where(p => !string.IsNullOrWhiteSpace(p)).Select(p => p.Trim('/')));
    }

    public static string PermissionName(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;

        // Convert PascalCase (GetUser) or camelCase (getUser) to (get_User)
        var snakeCase = Regex.Replace(input, "(?<!^)([A-Z])", "_$1");
        if (snakeCase.EndsWith("List"))
            return snakeCase.Replace("List", "View");
        if (snakeCase.EndsWith("Get"))
            return snakeCase.Replace("Get", "View");
        return snakeCase;
    }

    public static string UnderscoreToDot(string input)
    {
        return input.Replace("_", ".");
    }

    public static string GetVersion()
    {
        var versionString = Assembly.GetEntryAssembly()?
                                    .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?
                                    .InformationalVersion
                                    .ToString();
        if (string.IsNullOrEmpty(versionString))
            throw new Exception("No version found.");
        var pattern = @"\d+\.\d+\.\d+";
        var match = Regex.Match(versionString, pattern);
        if (match.Success)
            return match.Value;

        throw new Exception("No version found.");
    }
}
