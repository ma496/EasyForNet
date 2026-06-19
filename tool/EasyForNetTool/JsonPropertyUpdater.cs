namespace EasyForNetTool;

using System.Text.Json;
using System.Text.Json.Nodes;

/// <summary>
/// Provides methods to read, update and write JSON properties in a file by a dot-separated path.
/// </summary>
public static class JsonPropertyUpdater
{
    /// <summary>
    /// Updates a JSON property at the specified path with a new value, preserving the file structure.
    /// </summary>
    /// <param name="filePath">The path to the JSON file.</param>
    /// <param name="propertyPath">Dot-separated path to the property (e.g., "ConnectionStrings.DefaultConnection").</param>
    /// <param name="value">The new value to set (auto-detected as bool, number, null, or string).</param>
    public static async Task UpdateJsonPropertyAsync(string filePath, string propertyPath, string value)
    {
        if (!File.Exists(filePath))
            return;

        var json = JsonNode.Parse(File.ReadAllText(filePath))!;
        if (!IsPropertyExist(json, propertyPath))
            return;

        SetProperty(json, propertyPath, ConvertValue(value));

        var options = new JsonSerializerOptions { WriteIndented = true };
        await File.WriteAllTextAsync(filePath, json.ToJsonString(options));
    }

    /// <summary>
    /// Converts a raw string value to a JSON value, auto-detecting boolean, integer, long, double, null or string.
    /// </summary>
    private static JsonValue? ConvertValue(string raw)
    {
        // Try boolean
        if (bool.TryParse(raw, out var boolVal))
            return JsonValue.Create(boolVal);

        // Try number (int, long, double)
        if (int.TryParse(raw, out var intVal))
            return JsonValue.Create(intVal);

        if (long.TryParse(raw, out var longVal))
            return JsonValue.Create(longVal);

        if (double.TryParse(raw, out var doubleVal))
            return JsonValue.Create(doubleVal);

        // Try null
        if (raw.Equals("null", StringComparison.OrdinalIgnoreCase))
            return null;

        // Default = string
        return JsonValue.Create(raw);
    }

    /// <summary>
    /// Checks whether a dot-separated property path exists in the JSON tree.
    /// </summary>
    private static bool IsPropertyExist(JsonNode root, string path)
    {
        var parts = path.Split('.');
        var current = root;

        for (var i = 0; i < parts.Length - 1; i++)
        {
            var key = parts[i];

            if (current[key] == null || current[key] is not JsonObject)
            {
                return false;
            }

            current = current[key]!;
        }

        return true;
    }

    /// <summary>
    /// Sets a value at the specified dot-separated path in the JSON tree, creating intermediate objects as needed.
    /// </summary>
    private static void SetProperty(JsonNode root, string path, JsonNode? newValue)
    {
        var parts = path.Split('.');
        var current = root;

        for (var i = 0; i < parts.Length - 1; i++)
        {
            var key = parts[i];

            if (current[key] == null || current[key] is not JsonObject)
            {
                current[key] = new JsonObject();
            }

            current = current[key]!;
        }

        var finalKey = parts[^1];
        current.AsObject()[finalKey] = newValue;
    }
}

