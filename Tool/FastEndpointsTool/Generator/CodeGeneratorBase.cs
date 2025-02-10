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
        var fileName = Path.GetFileName(filePath);

        // Read the existing Allow.cs file
        var fileContent = File.ReadAllText(filePath);

        // Check if the Allow class exists with a more flexible pattern
        var allowClassPattern = @"class\s+Allow\s*\{";
        var allowClassMatch = Regex.Match(fileContent, allowClassPattern);
        if (!allowClassMatch.Success)
        {
            throw new InvalidOperationException("Could not find Allow class in the file.");
        }

        // Prepare the new permission string
        var newPermission = $"\tpublic const string {permissionName} = \"{Helpers.UnderscoreToDot(permissionName)}\";";

        // Check if the permission already exists
        if (Regex.IsMatch(fileContent, $@"\s*public\s+const\s+string\s+{permissionName}\s*=\s*""[^""]*""\s*;"))
        {
            Console.WriteLine($"Permission {permissionName} already defined in Allow.cs.");
            return;
        }

        // Find the closing brace of the Allow class
        var classContent = GetClassContent(fileContent, allowClassMatch.Index);
        var classEndIndex = allowClassMatch.Index + classContent.Length - 1; // -1 to point to the closing brace

        // Add the new permission just before the closing brace of the Allow class
        var updatedFileContent = fileContent.Substring(0, classEndIndex) +
                                (newLineBefore ? Environment.NewLine : string.Empty) +
                                newPermission +
                                Environment.NewLine +
                                fileContent.Substring(classEndIndex);

        // Save the modified file
        File.WriteAllText(filePath, updatedFileContent);
        Console.WriteLine($"Added permission {permissionName} to {fileName}");
    }

    private string GetClassContent(string fileContent, int classStartIndex)
    {
        var braceCount = 0;
        var endPos = -1;

        for (var i = classStartIndex; i < fileContent.Length; i++)
        {
            if (fileContent[i] == '{') braceCount++;
            else if (fileContent[i] == '}')
            {
                braceCount--;
                if (braceCount == 0)
                {
                    endPos = i + 1;
                    break;
                }
            }
        }

        if (endPos == -1)
        {
            throw new InvalidOperationException("Could not find end of Allow class.");
        }

        return fileContent.Substring(classStartIndex, endPos - classStartIndex);
    }

    protected void AddPermissionGroupToProvider(string filePath, string groupName, string displayName)
    {
        var fileName = Path.GetFileName(filePath);
        var fileContent = File.ReadAllText(filePath);

        // Find the Define method and its content
        var defineMethodPattern = @"public\s+void\s+Define\s*\(\s*PermissionDefinitionContext\s+context\s*\)\s*{";
        var defineMethodMatch = Regex.Match(fileContent, defineMethodPattern);
        if (!defineMethodMatch.Success)
        {
            throw new InvalidOperationException("Could not find Define method in PermissionDefinitionProvider.");
        }

        // Get Define method content
        var defineMethodContent = GetDefineMethodContent(fileContent, defineMethodMatch.Index);

        // Check if the permission group already exists within Define method
        var groupPattern = $@"var\s+{groupName.ToLowerFirst()}Permissions\s*=\s*context\.AddPermission\(\s*""{displayName}""\s*,\s*""{displayName}""\s*\)\s*;";
        if (Regex.IsMatch(defineMethodContent, groupPattern))
        {
            Console.WriteLine($"{groupName.ToLowerFirst()}Permissions group already defined in PermissionDefinitionProvider.Define method.");
            return;
        }

        // Create the new permission group line
        var newGroup = $"\n\t\tvar {groupName.ToLowerFirst()}Permissions = context.AddPermission(\"{displayName}\", \"{displayName}\");";

        // Insert the new group before the Define method's closing brace
        var lastBraceIndex = defineMethodContent.LastIndexOf('}');
        var updatedContent = fileContent.Insert(defineMethodMatch.Index + lastBraceIndex, newGroup + Environment.NewLine + "\t");

        File.WriteAllText(filePath, updatedContent);
        Console.WriteLine($"Added {groupName.ToLowerFirst()}Permissions group to {fileName}");
    }

    protected void AddPermissionToProvider(string filePath, string? groupName, string pluralName, string permissionName, string displayName)
    {
        var fileName = Path.GetFileName(filePath);
        var displayNameLast = displayName.SplitReturnLast("_");
        var fileContent = File.ReadAllText(filePath);

        // Find the Define method and its content
        var defineMethodPattern = @"public\s+void\s+Define\s*\(\s*PermissionDefinitionContext\s+context\s*\)\s*{";
        var defineMethodMatch = Regex.Match(fileContent, defineMethodPattern);
        if (!defineMethodMatch.Success)
        {
            throw new InvalidOperationException("Could not find Define method in PermissionDefinitionProvider.");
        }

        // Get Define method content
        var defineMethodContent = GetDefineMethodContent(fileContent, defineMethodMatch.Index);

        // Check if the permission already exists within Define method
        var permissionPattern = !string.IsNullOrWhiteSpace(groupName)
            ? $@"{groupName.ToLowerFirst()}Permissions\.AddChild\s*\(\s*Allow\.{permissionName}, ""{displayNameLast}""\)"
            : $@"context\.AddPermission\s*\(Allow.{permissionName}, ""{displayName}""\)";
        if (Regex.IsMatch(defineMethodContent, permissionPattern))
        {
            Console.WriteLine($"Permission {permissionName} already defined in PermissionDefinitionProvider.Define method.");
            return;
        }

        // Create the new permission line
        var newPermission = !string.IsNullOrWhiteSpace(groupName)
            ? $"\t\t{groupName.ToLowerFirst()}Permissions.AddChild(Allow.{permissionName}, \"{displayNameLast}\");"
            : $"\n\t\tcontext.AddPermission(Allow.{permissionName}, \"{displayName}\");";

        if (!string.IsNullOrWhiteSpace(groupName))
        {
            // Find the permissions group variable within Define method
            var groupPattern = $@"var\s+{groupName.ToLowerFirst()}Permissions\s*=\s*context\.AddPermission\(\s*""{pluralName}""\s*,\s*""{pluralName}""\s*\)\s*;";
            var groupMatch = Regex.Match(defineMethodContent, groupPattern);
            if (!groupMatch.Success)
            {
                // Add group if not found
                AddPermissionGroupToProvider(filePath, groupName, pluralName);

                // Re-read file content and find group again
                fileContent = File.ReadAllText(filePath);
                defineMethodContent = GetDefineMethodContent(fileContent, defineMethodMatch.Index);
                groupMatch = Regex.Match(defineMethodContent, groupPattern);
                if (!groupMatch.Success)
                {
                    throw new InvalidOperationException($"Could not find {groupName.ToLowerFirst()}Permissions group in PermissionDefinitionProvider.Define method after adding it.");
                }
            }

            // Find all permissions of the same group
            var groupPermissionPattern = $@"{groupName.ToLowerFirst()}Permissions\.AddChild\s*\([^;]+\)\s*;";
            var groupPermissions = Regex.Matches(defineMethodContent, groupPermissionPattern);

            if (groupPermissions.Count > 0)
            {
                // Get the last permission of the group
                var lastPermission = groupPermissions[groupPermissions.Count - 1];
                var insertPosition = defineMethodMatch.Index + lastPermission.Index + lastPermission.Length;

                // Insert the new permission after the last permission of the group
                var updatedContent = fileContent.Insert(insertPosition, Environment.NewLine + newPermission);
                File.WriteAllText(filePath, updatedContent);
            }
            else
            {
                // If no existing permissions in the group, add after the group declaration
                var groupLineEnd = defineMethodContent.IndexOf('\n', groupMatch.Index) + 1;
                var updatedContent = fileContent.Insert(defineMethodMatch.Index + groupLineEnd, newPermission + Environment.NewLine);
                File.WriteAllText(filePath, updatedContent);
            }

            Console.WriteLine($"Added permission {permissionName} to {groupName}Permissions group in {fileName}");
        }
        else
        {
            // Insert the new permission before the Define method's closing brace
            var lastBraceIndex = defineMethodContent.LastIndexOf('}');
            var updatedContent = fileContent.Insert(defineMethodMatch.Index + lastBraceIndex, newPermission + Environment.NewLine + "\t");

            File.WriteAllText(filePath, updatedContent);
            Console.WriteLine($"Added permission {permissionName} to {fileName}");
        }
    }

    private string GetDefineMethodContent(string fileContent, int defineMethodStartIndex)
    {
        var braceCount = 0;
        var endPos = -1;

        for (var i = defineMethodStartIndex; i < fileContent.Length; i++)
        {
            if (fileContent[i] == '{') braceCount++;
            else if (fileContent[i] == '}')
            {
                braceCount--;
                if (braceCount == 0)
                {
                    endPos = i + 1;
                    break;
                }
            }
        }

        if (endPos == -1)
        {
            throw new InvalidOperationException("Could not find end of Define method in PermissionDefinitionProvider.");
        }

        return fileContent.Substring(defineMethodStartIndex, endPos - defineMethodStartIndex);
    }
}

