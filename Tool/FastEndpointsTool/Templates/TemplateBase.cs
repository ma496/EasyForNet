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

    protected string Merge(List<string> namespaces, string @namespace, string code)
    {
        var builder = new StringBuilder();
        var uniqueNamespaces = namespaces.Distinct().ToList();
        if (uniqueNamespaces.Count > 0)
        {
            uniqueNamespaces.ForEach(x => builder.AppendLine($"using {x};"));
            if (uniqueNamespaces.Count > 0)
                builder.AppendLine();
        }
        builder.AppendLine($"namespace {@namespace};");
        builder.AppendLine(code);
        return builder.ToString();
    }

    protected List<PropertyInfo> GetScalarProperties(Assembly assembly, string entityName, string entityFullName, bool includeId, string baseProperties)
    {
        var entityType = SingleType(assembly, entityFullName);
        var excludePropertiesMethod = entityType.GetMethod("ExcludeProperties");
        var excludeProperties = new List<string>();
        if (baseProperties == "false")
        {
            excludeProperties.Add("CreatedAt");
            excludeProperties.Add("CreatedBy");
            excludeProperties.Add("UpdatedAt");
            excludeProperties.Add("UpdatedBy");
        }
        if (excludePropertiesMethod != null)
        {
            excludeProperties.AddRange(excludePropertiesMethod.Invoke(null, null) as List<string> ?? new List<string>());
        }
        var properties = entityType.GetProperties()
            .Where(p => p.PropertyType.IsValueType || p.PropertyType == typeof(string))
            .Where(p => !IsId(p.Name, entityName))
            .Where(p => !excludeProperties.Contains(p.Name))
            .ToList();
        if (includeId)
            properties.Insert(0, GetIdProperty(assembly, entityName, entityFullName));
        return properties;
    }

    protected string MappingPropertiesCode(Assembly assembly, string entityName, string entityFullName, string parameter, bool includeId, string baseProperties, string? leftParameter = null)
    {
        var properties = GetScalarProperties(assembly, entityName, entityFullName, includeId, baseProperties);
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

    protected string UpdatePropertiesCode(Assembly assembly, string entityName, string entityFullName, string parameter, bool includeId, string baseProperties, string? leftParameter = null)
    {
        var properties = GetScalarProperties(assembly, entityName, entityFullName, includeId, baseProperties);
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
            throw new UserFriendlyException($"{fullName} type not found.");
        if (types.Count > 1)
            throw new UserFriendlyException($"{fullName} multiple types found.");

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
            throw new UserFriendlyException($"No id found in {entityFullName}");

        if (idProperties.Count > 1)
            throw new UserFriendlyException($"More then one ids found in {entityFullName}");

        return idProperties[0];
    }

    protected string GetPropertiesCode(List<PropertyInfo> properties, int tab = 1)
    {
        var builder = new StringBuilder();
        var index = 0;
        foreach (var p in properties)
        {
            builder.Append($"{(index > 0 ? "\t" : "")}public {ConvertToAlias(GetPropertyName(p))} {p.Name} {{ get; set; }}{NullForgiving(p)}{(index == properties.Count - 1 ? string.Empty : Environment.NewLine)}");
            index++;
        }
        return builder.ToString();
    }

    protected string GetPropertyName(PropertyInfo property)
    {
        var type = property.PropertyType;
        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
        {
            var underlyingType = Nullable.GetUnderlyingType(type);
            return $"{underlyingType!.Name}?";
        }
        else
        {
            var typeName = type.Name;
            if (type == typeof(string))
            {
                var nullabilityContext = new NullabilityInfoContext();
                var nullabilityInfo = nullabilityContext.Create(property);
                if (nullabilityInfo.WriteState is NullabilityState.Nullable)
                {
                    typeName += "?";
                }
            }
            return typeName;
        }
    }

    protected string NullForgiving(PropertyInfo property)
    {
        if (property.PropertyType == typeof(string))
        {
            var nullabilityContext = new NullabilityInfoContext();
            var nullabilityInfo = nullabilityContext.Create(property);
            if (nullabilityInfo.WriteState is NullabilityState.NotNull)
            {
                return " = null!;";
            }
        }
        return string.Empty;
    }

    protected string ConvertToAlias(string typeName)
    {
        // Dictionary mapping fully qualified type names to their C# aliases
        var typeAliasMap = new Dictionary<string, string>
        {
            { "Boolean", "bool" },
            { "Boolean?", "bool?" },
            { "Byte", "byte" },
            { "Byte?", "byte?" },
            { "SByte", "sbyte" },
            { "SByte?", "sbyte?" },
            { "Char", "char" },
            { "Char?", "char?" },
            { "Decimal", "decimal" },
            { "Decimal?", "decimal?" },
            { "Double", "double" },
            { "Double?", "double?" },
            { "Single", "float" },
            { "Single?", "float?" },
            { "Int32", "int" },
            { "Int32?", "int?" },
            { "UInt32", "uint" },
            { "UInt32?", "uint?" },
            { "Int64", "long" },
            { "Int64?", "long?" },
            { "UInt64", "ulong" },
            { "UInt64?", "ulong?" },
            { "Int16", "short" },
            { "Int16?", "short?" },
            { "UInt16", "ushort" },
            { "UInt16?", "ushort?" },
            { "String", "string" },
            { "String?", "string?" },
            { "Object", "object" },
            { "Object?", "object?" }
        };

        // Try to get the alias, return the original typeName if no alias is found
        return typeAliasMap.TryGetValue(typeName, out var alias) ? alias : typeName;
    }
    
    protected (DtoMapping? mapping, Type? entityBaseType) GetDtoMapping(Assembly assembly, FeToolSetting setting, string entityFullName)
    {
        var entityType = assembly.GetType(entityFullName);
        if (entityType == null)
        {
            throw new Exception($"Could not find type '{entityFullName}'");
        }

        DtoMapping? dtoMapping = null;
        var baseType = entityType.BaseType;
        while (baseType != null)
        {
            dtoMapping = setting.Project.DtoMappings.Find(x => x.Entity == baseType.FullName 
                                                               || baseType.FullName!.Contains($"{x.Entity}`"));
            if (dtoMapping != null)
                break;
            baseType = baseType.BaseType;
        }
        
        return (dtoMapping, baseType);
    }

    protected (string? namespaceName, string? className) GetDtoClass(DtoMapping? mapping, Type? entityBaseType)
    {
        if (mapping == null || entityBaseType == null)
            return (null, null);
        if (!entityBaseType.IsGenericType)
        {
            return GetNamespaceAndClassName(mapping.Dto);
        }
        
        var namespaceAndClassName = GetNamespaceAndClassName(mapping.Dto);
        return (namespaceAndClassName.namespaceName, $"{namespaceAndClassName.className}<{string.Join(",", entityBaseType.GetGenericArguments().Select(x => x.Name))}>");
    }

    protected (string namespaceName, string className) GetNamespaceAndClassName(string fullName)
    {
        var parts = fullName.Split('.');
        return (string.Join(".", parts.Take(parts.Length - 1)), parts.Last());
    }
}
