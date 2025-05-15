using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using FastEndpointsTool.Extensions;

namespace FastEndpointsTool.Templates;

public abstract class TemplateBase<TArgument> : ITemplate<TArgument>
    where TArgument : class
{
    public abstract string Template(TArgument arg);

    protected string DeleteLines(string input)
    {
        var lines = input.Split(Environment.NewLine);
        var builder = new StringBuilder();
        for (var i = 0; i < lines.Length; i++)
        {
            var line = lines[i];
            // use regex to find (Remove {lineCount} lines) in line
            var match = Regex.Match(line, @"^\s*Remove\s+(\d+)\s+lines\s*$");
            if (match.Success)
            {
                var lineCount = int.Parse(match.Groups[1].Value);
                i += lineCount;
            }
            else
            {
                builder.AppendLine(line);
            }
        }
        return builder.ToString();
    }

    protected string RemoveLine(int lineCount = 1)
    {
        if (lineCount < 1)
            throw new Exception("Line count must be greater than or equal to 1.");

        // return placeholder for remove lines
        return $"Remove {lineCount - 1} lines";
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

    protected List<PropertyInfo> GetScalarProperties(Assembly assembly, string entityName, string entityFullName, DtoClass? dtoBaseClass = null, bool includeId = false, bool onlySetProperties = false)
    {
        var entityType = SingleType(assembly, entityFullName);
        var excludeProperties = dtoBaseClass?.classType?
            .GetProperties(BindingFlags.Instance | BindingFlags.Public)
            .Where(p => p.PropertyType.IsValueType || p.PropertyType == typeof(string))
            .WhereIf(includeId, p => !IsId(p.Name, entityName))
            .Select(p => p.Name).ToList() ?? [];
        var properties = entityType
            .GetProperties(BindingFlags.Instance | BindingFlags.Public)
            .Where(p => p.PropertyType.IsValueType || p.PropertyType == typeof(string))
            .Where(p => !excludeProperties.Contains(p.Name))
            .WhereIf(onlySetProperties, p => p.SetMethod != null && p.SetMethod.IsPublic)
            .ToList();

        // place Id property at the first, if it exists
        if (properties.Any(p => IsId(p.Name, entityName)))
        {
            var idProperty = properties.First(p => IsId(p.Name, entityName));
            properties.Remove(idProperty);
            properties.Insert(0, idProperty);
        }
        return properties;
    }

    protected string MappingPropertiesCode(List<PropertyInfo> properties, string parameter, string? leftParameter = null)
    {
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

    protected string UpdatePropertiesCode(List<PropertyInfo> properties, string parameter, string? leftParameter = null)
    {
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
            // remove any thing b/w [] using regex
            var baseTypeFullName = Regex.Replace(baseType.FullName ?? string.Empty, @"(\[.*?\])|\]", string.Empty);
            dtoMapping = setting.Project.DtoMappings.Find(x => x.Entity == baseTypeFullName);
            if (dtoMapping != null)
            {
                dtoMapping.DtoWithArguments = baseType.FullName ?? string.Empty;
                break;
            }
            baseType = baseType.BaseType;
        }

        return (dtoMapping, baseType);
    }

    protected DtoClass GetDtoClass(Assembly assembly, DtoMapping? mapping, Type? entityBaseType)
    {
        if (mapping == null || entityBaseType == null)
            return new(null, null, null);

        Type? dtoType = null;
        (string? namespaceName, string? className) member;

        if (!entityBaseType.IsGenericType)
        {
            dtoType = assembly.GetType(mapping.Dto);
            if (dtoType == null)
                throw new UserFriendlyException($"Dto type {mapping.Dto} not found.");
            member = GetNamespaceAndMemberName(mapping.Dto);
            return new(member.namespaceName, member.className, dtoType);
        }

        dtoType = assembly.GetType(mapping.DtoWithArguments);
        if (dtoType == null)
            throw new UserFriendlyException($"Dto type {mapping.DtoWithArguments} not found.");
        member = GetNamespaceAndMemberName(mapping.Dto);
        var classNameWithArguments = $"{Regex.Replace(member.className ?? string.Empty, @"`\d", "")}<{string.Join(",", dtoType.GetGenericArguments().Select(x => ConvertToAlias(x.Name)))}>";
        return new(member.namespaceName, classNameWithArguments, dtoType);
    }

    protected (string namespaceName, string className) GetNamespaceAndMemberName(string fullName)
    {
        var parts = fullName.Split('.');
        return (string.Join(".", parts.Take(parts.Length - 1)), parts.Last());
    }
}

public record DtoClass(string? namespaceName, string? className, Type? classType);
