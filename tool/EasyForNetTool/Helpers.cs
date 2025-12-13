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
}
