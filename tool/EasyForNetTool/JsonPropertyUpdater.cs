namespace EasyForNetTool;

using System.Text.Json;
using System.Text.Json.Nodes;

public static class JsonPropertyUpdater
{
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

