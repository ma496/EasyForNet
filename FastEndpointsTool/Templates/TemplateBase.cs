using FastEndpointsTool.Extensions;
using System.Reflection;
using System.Text;

namespace FastEndpointsTool.Templates;

public abstract class TemplateBase<TArgument> : ITemplate<TArgument>
    where TArgument : class
{
    public abstract string Template(TArgument arg);

    protected string DeleteLine(string input, int lineIndex)
    {
        string?[] lines = input.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);

        if (lineIndex < 0 || lineIndex >= lines.Length)
        {
            return input; // Return the original string if out of bounds
        }

        // Remove the specified line
        lines[lineIndex] = null;

        // Reconstruct the string without the null (deleted) line
        return string.Join(Environment.NewLine, lines.Where(line => line != null));
    }

    protected string GetScalarPropertiesCode(Type type)
    {
        var properties = type.GetProperties()
            .Where(p => p.PropertyType.IsValueType || p.PropertyType == typeof(string));
        var builder = new StringBuilder();
        foreach (var p in properties)
        {
            builder.AppendLine($"public {p.PropertyType} {p.Name} {{get; set;}}");
        }
        return builder.ToString();
    }

    protected List<PropertyInfo> GetScalarProperties(Assembly assembly, string entityName, string entityFullName, bool includeId)
    {
        var types = assembly.GetTypes()
            .Where(t => t.FullName == entityFullName)
            .ToList();

        if (types.Count == 0)
            throw new Exception($"No entity found of type {entityFullName}.");
        if (types.Count > 1)
            throw new Exception($"Multiple entities found of type {entityFullName}.");

        var entityType = types[0];
        var properties = entityType.GetProperties()
            .Where(p => p.PropertyType.IsValueType || p.PropertyType == typeof(string))
            .WhereIf(!includeId, p => p.Name != "Id" && p.Name != $"{entityName}Id")
            .ToList();
        return properties;
    }

    protected string GetPropertiesCode(List<PropertyInfo> properties, int tab = 1)
    {
        var builder = new StringBuilder();
        var index = 0;
        foreach (var p in properties)
        {
            builder.AppendLine($"{(index > 0 ? "\t" : "")}public {ConvertToAlias(p.PropertyType.Name)} {p.Name} {{get; set;}}");
            index++;
        }
        return builder.ToString();
    }

    protected string ConvertToAlias(string typeName)
    {
        // Dictionary mapping fully qualified type names to their C# aliases
        var typeAliasMap = new Dictionary<string, string>
        {
            { "Boolean", "bool" },
            { "Byte", "byte" },
            { "SByte", "sbyte" },
            { "Char", "char" },
            { "Decimal", "decimal" },
            { "Double", "double" },
            { "Single", "float" },
            { "Int32", "int" },
            { "UInt32", "uint" },
            { "Int64", "long" },
            { "UInt64", "ulong" },
            { "Int16", "short" },
            { "UInt16", "ushort" },
            { "String", "string" },
            { "Object", "object" }
        };

        // Try to get the alias, return the original typeName if no alias is found
        return typeAliasMap.TryGetValue(typeName, out var alias) ? alias : typeName;
    }
}
