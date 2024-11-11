using FastEndpointsTool.Extensions;
using System.Reflection;
using System.Text;

namespace FastEndpointsTool.Templates;

public abstract class TemplateBase<TArgument> : ITemplate<TArgument>
    where TArgument : class
{
    public abstract string Template(TArgument arg);

    protected List<int> RemoveLineIndexes { get; set; } = new List<int>();

    protected string DeleteLines(string input)
    {
        string?[] lines = input.Split(["\r\n", "\r", "\n"], StringSplitOptions.None);

        foreach (var lineIndex in RemoveLineIndexes)
        {
            if (lineIndex < 0 || lineIndex >= lines.Length)
            {
                continue;
            }

            // Remove the specified line
            lines[lineIndex] = null;
        }

        // Reconstruct the string without the null (deleted) line
        return string.Join(Environment.NewLine, lines.Where(line => line != null));
    }

    protected string RemoveLine(params int[] lineIndexes)
    {
        RemoveLineIndexes.AddRange(lineIndexes);
        return string.Empty;
    }

    protected string Merge(List<string> usingNamespaces, string @namespace, string code)
    {
        var builder = new StringBuilder();
        if (usingNamespaces != null)
        {
            usingNamespaces.ForEach(x => builder.AppendLine($"using {x};"));
            if (usingNamespaces.Count > 0)
                builder.AppendLine();
        }
        builder.AppendLine($"namespace {@namespace};");
        builder.AppendLine(code);
        return builder.ToString();
    }

    protected List<PropertyInfo> GetScalarProperties(Assembly assembly, string entityName, string entityFullName, bool includeId)
    {
        var entityType = SingleType(assembly, entityFullName);
        var properties = entityType.GetProperties()
            .Where(p => p.PropertyType.IsValueType || p.PropertyType == typeof(string))
            .WhereIf(!includeId, p => !IsId(p.Name, entityName))
            .ToList();
        return properties;
    }

    protected string MappingPropertiesCode(Assembly assembly, string entityName, string entityFullName, string parameter, bool includeId, string? leftParameter = null)
    {
        var properties = GetScalarProperties(assembly, entityName, entityFullName, includeId);
        var codeBuilder = new StringBuilder();

        for (int i = 0; i < properties.Count; i++)
        {
            var p = properties[i];
            var propertyName = string.IsNullOrWhiteSpace(leftParameter) ? p.Name : $"{leftParameter}.{p.Name}";
            var line = $"{propertyName} = {parameter}.{p.Name},";

            if (i == 0)
            {
                codeBuilder.AppendLine(line);
            }
            else if (i == properties.Count - 1)
            {
                codeBuilder.Append($"\t\t\t{line}");
            }
            else
            {
                codeBuilder.AppendLine($"\t\t\t{line}");
            }
        }

        return codeBuilder.ToString();
    }

    protected string UpdatePropertiesCode(Assembly assembly, string entityName, string entityFullName, string parameter, bool includeId, string? leftParameter = null)
    {
        var properties = GetScalarProperties(assembly, entityName, entityFullName, includeId);
        var codeBuilder = new StringBuilder();

        for (int i = 0; i < properties.Count; i++)
        {
            var p = properties[i];
            var propertyName = string.IsNullOrWhiteSpace(leftParameter) ? p.Name : $"{leftParameter}.{p.Name}";
            var line = $"{propertyName} = {parameter}.{p.Name};";

            if (i == 0)
            {
                codeBuilder.AppendLine(line);
            }
            else if (i == properties.Count - 1)
            {
                codeBuilder.Append($"\t\t{line}");
            }
            else
            {
                codeBuilder.AppendLine($"\t\t{line}");
            }
        }

        return codeBuilder.ToString();
    }

    protected Type SingleType(Assembly assembly, string fullName)
    {
        var types = assembly.GetTypes()
            .Where(t => t.FullName == fullName)
            .ToList();

        if (types.Count == 0)
            throw new Exception($"{fullName} type not found.");
        if (types.Count > 1)
            throw new Exception($"{fullName} multiple types found.");

        return types[0];
    }

    protected bool IsId(string propertyName, string entityName)
    {
        return propertyName == "Id" || propertyName == $"{entityName}Id";
    }

    protected PropertyInfo GetIdProperty(Assembly assembly, string entityName, string entityFullName)
    {
        var type = SingleType(assembly, entityFullName);

        var idProperties = 
            type.GetProperties()
            .Where(p => IsId(p.Name, entityName))
            .ToList();

        if (idProperties.Count == 0)
            throw new Exception($"No id found in {entityFullName}");

        if (idProperties.Count > 1)
            throw new Exception($"More then one ids found in {entityFullName}");

        return idProperties[0];
    }

    protected string GetPropertiesCode(List<PropertyInfo> properties, int tab = 1)
    {
        var builder = new StringBuilder();
        var index = 0;
        foreach (var p in properties)
        {
            builder.Append($"{(index > 0 ? "\t" : "")}public {ConvertToAlias(p.PropertyType.Name)} {p.Name} {{ get; set; }}{(index == properties.Count - 1 ? string.Empty : Environment.NewLine)}");
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
