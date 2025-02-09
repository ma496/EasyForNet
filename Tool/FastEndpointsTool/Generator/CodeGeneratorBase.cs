using System.Text.RegularExpressions;
using FastEndpointsTool.Extensions;
using FastEndpointsTool.Parsing;

namespace FastEndpointsTool.Generator;

public abstract class CodeGeneratorBase<TArgument>
    where TArgument : Argument
{
    public abstract Task Generate(TArgument argument);

    protected string GetEndpointDir(string projectDir, string endpointPath, string output)
    {
        var endpointDir = Path.Combine(projectDir, endpointPath, output ?? string.Empty);
        return endpointDir;
    }

    protected string GetClassNamespace(string projectDir, string projectName, string className)
    {
        var assembly = Helpers.GetProjectAssembly(projectDir, projectName);
        var types = assembly.GetTypes()
            .Where(t => t.Name == className)
            .ToArray();

        if (types.Length == 0) return string.Empty;
        if (types.Length == 1) return types[0].Namespace ?? string.Empty;
        Console.WriteLine("Multiple types found.");
        var index = 0;
        foreach (var t in types)
        {
            Console.WriteLine($"{t.FullName}: Type {index} then enter");
            index++;
        }
        var indexStr = Console.ReadLine();
        var isInteger = int.TryParse(indexStr, out var selectIndex);
        if (!isInteger)
            throw new UserFriendlyException("input is not integer.");
        if (selectIndex >= 0 && selectIndex < index)
            return types[selectIndex].Namespace ?? string.Empty;
        throw new UserFriendlyException("input number out of range");
    }

    protected string GetEndpointNamespace(string rootNamespace, string endpointPath, string? output)
    {
        // replace slash to dot
        endpointPath = Regex.Replace(endpointPath, @"[\\/]+", ".");
        output = Regex.Replace(output ?? string.Empty, @"[\\/]+", ".");
        // replace multiple dots to one
        endpointPath = Regex.Replace(endpointPath, @"\.+", ".");
        output = Regex.Replace(output ?? string.Empty, @"\.+", ".");
        // remove dot at the beginning
        endpointPath = endpointPath.TrimStart('.');
        output = output?.TrimStart('.');
        return $"{rootNamespace}.{endpointPath}" + (string.IsNullOrWhiteSpace(output) ? string.Empty : $".{output}");
    }

    protected void AddPermissionToAllowClass(string filePath, string permissionName, bool newLineBefore = true)
    {
        // Read the existing Allow.cs file
        var fileContent = File.ReadAllText(filePath);

        // Prepare the new permission string
        var newPermission = $"\tpublic const string {permissionName} = \"{Helpers.UnderscoreToDot(permissionName)}\";";

        // Check if the permission already exists
        if (Regex.IsMatch(fileContent, $@"\s*public\s+const\s+string\s+{permissionName}\s*=\s*""[^""]*""\s*;"))
        {
            Console.WriteLine($"Permission {permissionName} already defined in Allow.cs.");
            return;
        }


        // Insert the new permission before the closing brace of the class
        var classEndIndex = fileContent.LastIndexOf("}");
        if (classEndIndex == -1)
        {
            throw new InvalidOperationException("Invalid Allow.cs class format.");
        }

        // Add the new permission just before the closing brace
        var updatedFileContent = fileContent.Substring(0, classEndIndex) + (newLineBefore ? Environment.NewLine : string.Empty) + newPermission + Environment.NewLine + fileContent.Substring(classEndIndex);

        // Save the modified file
        File.WriteAllText(filePath, updatedFileContent);
        Console.WriteLine($"Added permission {permissionName} to {filePath}");
    }

    protected void AddPermissionGroupToProvider(string filePath, string groupName, string displayName)
    {
        var fileContent = File.ReadAllText(filePath);

        // Check if the permission group already exists
        var groupPattern = $@"var\s+{groupName.ToLowerFirst()}Permissions\s*=\s*context\.AddPermission\(\s*""{displayName}""\s*,\s*""{displayName}""\s*\)\s*;";
        if (Regex.IsMatch(fileContent, groupPattern))
        {
            Console.WriteLine($"{groupName.ToLowerFirst()}Permissions group already defined in PermissionDefinitionProvider.Define method.");
            return;
        }

        // Create the new permission group line
        var newGroup = $"\n\t\tvar {groupName.ToLowerFirst()}Permissions = context.AddPermission(\"{displayName}\", \"{displayName}\");";

        // Find the Define method
        var defineMethodPattern = @"public\s+void\s+Define\s*\(\s*PermissionDefinitionContext\s+context\s*\)\s*{";
        var defineMethodMatch = Regex.Match(fileContent, defineMethodPattern);
        if (!defineMethodMatch.Success)
        {
            throw new InvalidOperationException("Could not find Define method in PermissionDefinitionProvider.");
        }

        // Find the matching closing brace for Define method
        var startPos = defineMethodMatch.Index;
        var braceCount = 0;
        var endPos = -1;

        for (var i = startPos; i < fileContent.Length; i++)
        {
            if (fileContent[i] == '{') braceCount++;
            else if (fileContent[i] == '}')
            {
                braceCount--;
                if (braceCount == 0)
                {
                    endPos = i;
                    break;
                }
            }
        }

        if (endPos == -1)
        {
            throw new InvalidOperationException("Could not find end of Define method in PermissionDefinitionProvider.");
        }

        // Insert the new group before the Define method's closing brace
        var updatedContent = fileContent.Insert(endPos, newGroup + Environment.NewLine + "\t");

        File.WriteAllText(filePath, updatedContent);
        Console.WriteLine($"Added {groupName.ToLowerFirst()}Permissions group to {filePath}");
    }

    protected void AddPermissionToProvider(string filePath, string? groupName, string pluralName, string permissionName, string displayName)
    {
        var fileContent = File.ReadAllText(filePath);

        // Check if the permission already exists
        var permissionPattern = !string.IsNullOrWhiteSpace(groupName)
            ? $@"{groupName.ToLowerFirst()}Permissions\.AddChild\s*\(\s*Allow\.{permissionName}, ""{displayName}""\)"
            : $@"context\.AddPermission\s*\(""{permissionName}"", ""{displayName}""\)";
        if (Regex.IsMatch(fileContent, permissionPattern))
        {
            Console.WriteLine($"Permission {permissionName} already defined in PermissionDefinitionProvider.Define method.");
            return;
        }


        // Create the new permission line
        var newPermission = !string.IsNullOrWhiteSpace(groupName)
            ? $"\t\t{groupName.ToLowerFirst()}Permissions.AddChild(Allow.{permissionName}, \"{displayName}\");"
            : $"\n\t\tcontext.AddPermission(\"{permissionName}\", \"{displayName}\");";


        if (!string.IsNullOrWhiteSpace(groupName))
        {
            // Find the permissions group variable

            var groupPattern = $@"var\s+{groupName.ToLowerFirst()}Permissions\s*=\s*context\.AddPermission\(\s*""{pluralName}""\s*,\s*""{pluralName}""\s*\)\s*;";
            var groupMatch = Regex.Match(fileContent, groupPattern);
            if (!groupMatch.Success)
            {
                // Add group if not found
                AddPermissionGroupToProvider(filePath, groupName, pluralName);


                // Re-read file content and find group again
                fileContent = File.ReadAllText(filePath);
                groupMatch = Regex.Match(fileContent, groupPattern);
                if (!groupMatch.Success)
                {
                    throw new InvalidOperationException($"Could not find {groupName.ToLowerFirst()}Permissions group in PermissionDefinitionProvider.Define method after adding it.");
                }
            }

            // Find the end of the group line
            var groupLineEnd = fileContent.IndexOf('\n', groupMatch.Index) + 1;

            // Insert the new permission after the group line
            var updatedContent = fileContent.Insert(groupLineEnd, newPermission + Environment.NewLine);

            File.WriteAllText(filePath, updatedContent);
            Console.WriteLine($"Added permission {permissionName} to {groupName}Permissions group in {filePath}");
        }
        else
        {
            // Find the Define method
            var defineMethodPattern = @"public\s+void\s+Define\s*\(\s*PermissionDefinitionContext\s+context\s*\)\s*{";
            var defineMethodMatch = Regex.Match(fileContent, defineMethodPattern);
            if (!defineMethodMatch.Success)
            {
                throw new InvalidOperationException("Could not find Define method in PermissionDefinitionProvider.");
            }

            // Find the matching closing brace for Define method
            var startPos = defineMethodMatch.Index;
            var braceCount = 0;
            var endPos = -1;

            for (var i = startPos; i < fileContent.Length; i++)
            {
                if (fileContent[i] == '{') braceCount++;
                else if (fileContent[i] == '}')
                {
                    braceCount--;
                    if (braceCount == 0)
                    {
                        endPos = i;
                        break;
                    }
                }
            }

            if (endPos == -1)
            {
                throw new InvalidOperationException("Could not find end of Define method in PermissionDefinitionProvider.");
            }

            // add permission without group
            var updatedContent = fileContent.Insert(endPos, newPermission + Environment.NewLine + "\t");

            File.WriteAllText(filePath, updatedContent);
            Console.WriteLine($"Added permission {permissionName} to {filePath}");
        }
    }
}

