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
        var camelCase = ToCamelCase(value);
        if (camelCase.Length > 0)
            return char.ToUpper(camelCase[0]) + camelCase.Substring(1);
        return camelCase;
    }

    public static string ToKebabCase(this string value)
    {
        return string.Concat(value.Select((x, i) => i > 0 && char.IsUpper(x) ? "-" + char.ToLower(x) : char.ToLower(x).ToString())).ToLower();
    }

    public static string ToLowerFirst(this string str)
    {
        if (string.IsNullOrEmpty(str))
            return str;
        return char.ToLower(str[0]) + str[1..];
    }

    public static string SplitReturnLast(this string str, string separator)
    {
        return !string.IsNullOrWhiteSpace(str) && str.Contains(separator) ? str.Split(separator).Last() : str;
    }
}
