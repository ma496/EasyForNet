using System.Reflection;
using System.Text.RegularExpressions;

namespace EasyForNetTool;

public static class Helpers
{
    public static string GetVersion()
    {
        var versionString = Assembly.GetEntryAssembly()?
            .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?
            .InformationalVersion;
        if (string.IsNullOrEmpty(versionString))
            throw new Exception("No version found.");
        var pattern = @"\d+\.\d+\.\d+";
        var match = Regex.Match(versionString, pattern);
        if (match.Success)
            return match.Value;

        throw new Exception("No version found.");
    }

    public static bool IsProduction()
    {
#if DEBUG
        return false;
#else
        return true;
#endif
    }
    public static string? GetRootNamespace(string path)
    {
        var projectPath = Directory.GetFiles(path, "*.csproj").FirstOrDefault();
        if (string.IsNullOrEmpty(projectPath))
            return null;

        var rootNamespace = Path.GetFileNameWithoutExtension(projectPath);
        var content = File.ReadAllText(projectPath);
        var match = Regex.Match(content, @"<RootNamespace>(.*?)</RootNamespace>");
        if (match.Success)
            rootNamespace = match.Groups[1].Value;

        return rootNamespace;
    }
}
