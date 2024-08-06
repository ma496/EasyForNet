using System.Text.Json;

namespace FastEndpointsTool.Extensions;

public static class StringExt
{
    public static string ToCamelCase(this string value)
    {
        return JsonNamingPolicy.CamelCase.ConvertName(value);
    }

    public static string ToPascalCase(this string value)
    {
        var camelCase = JsonNamingPolicy.CamelCase.ConvertName(value);
        if (camelCase.Length > 0)
            return char.ToUpper(camelCase[0]) + camelCase.Substring(1);
        return camelCase;
    }
}
