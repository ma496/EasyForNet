using FastEndpointsTool.Templates;
using System.Reflection;
using System.Text;
using FastEndpointsTool.Parsing;
using FastEndpointsTool.Extensions;

namespace FastEndpointsTool.Generator;

public class EndpointGenerator : CodeGeneratorBase<EndpointArgument>
{
    public override async Task Generate(EndpointArgument argument)
    {
        var directory = Directory.GetCurrentDirectory();
        var (setting, projectDir) = await Helpers.GetSetting(directory);

        if (argument.Type == ArgumentType.CrudEndpoint)
        {
            argument.Output = Path.Combine(argument.Output ?? string.Empty, argument.PluralName);
            var endpointDir = GetEndpointDir(projectDir, setting.Project.EndpointPath, argument.Output);
            if (!Directory.Exists(endpointDir))
                Directory.CreateDirectory(endpointDir);

            await GenerateCrudGroup(argument, setting, endpointDir);
            argument.Group = $"{argument.PluralName}Group";

            var entityNamespace = GetClassNamespace(projectDir, setting.Project.Name, argument.Entity);
            var groupNamespace = string.Empty;
            var dataContextNamespace = GetClassNamespace(projectDir, setting.Project.Name, argument.DataContext);

            // add permission group to permission definition provider
            AddPermissionGroupToProvider(Path.Combine(projectDir, setting.Project.PermissionDefinitionProviderPath), argument.Group.Replace("Group", ""), argument.PluralName);

            // create endpoint
            var createEndpointArgument = (EndpointArgument)argument.Clone();
            createEndpointArgument.Type = ArgumentType.CreateEndpoint;
            createEndpointArgument.Method = "post";
            createEndpointArgument.Name = Helpers.EndpointName(createEndpointArgument.Name, createEndpointArgument.Type);
            if (createEndpointArgument.Authorization.ToLower() == "true" && string.IsNullOrWhiteSpace(createEndpointArgument.Permission))
            {
                createEndpointArgument.Permission = Helpers.PermissionName(createEndpointArgument.Name);
                AddPermissionToAllowClass(Path.Combine(projectDir, setting.Project.AllowClassPath), createEndpointArgument.Permission);
                AddPermissionToProvider(Path.Combine(projectDir, setting.Project.PermissionDefinitionProviderPath), argument.Group.Replace("Group", ""),
                    argument.PluralName, createEndpointArgument.Permission, createEndpointArgument.Permission.SplitReturnLast("_"));


            }
            else if (!string.IsNullOrWhiteSpace(createEndpointArgument.Permission))
            {
                AddPermissionToAllowClass(Path.Combine(projectDir, setting.Project.AllowClassPath), createEndpointArgument.Permission);
                AddPermissionToProvider(Path.Combine(projectDir, setting.Project.PermissionDefinitionProviderPath), argument.Group.Replace("Group", ""),
                    argument.PluralName, createEndpointArgument.Permission, createEndpointArgument.Permission.SplitReturnLast("_"));
            }



            await GenerateEndpoint(createEndpointArgument, setting, endpointDir, entityNamespace, groupNamespace, dataContextNamespace);


            // update endpoint
            var updateEndpointArgument = (EndpointArgument)argument.Clone();
            updateEndpointArgument.Type = ArgumentType.UpdateEndpoint;
            updateEndpointArgument.Method = "put";
            updateEndpointArgument.Name = Helpers.EndpointName(updateEndpointArgument.Name, updateEndpointArgument.Type);
            if (updateEndpointArgument.Authorization.ToLower() == "true" && string.IsNullOrWhiteSpace(updateEndpointArgument.Permission))
            {
                updateEndpointArgument.Permission = Helpers.PermissionName(updateEndpointArgument.Name);
                AddPermissionToAllowClass(Path.Combine(projectDir, setting.Project.AllowClassPath), updateEndpointArgument.Permission, false);
                AddPermissionToProvider(Path.Combine(projectDir, setting.Project.PermissionDefinitionProviderPath), argument.Group.Replace("Group", ""),
                    argument.PluralName, updateEndpointArgument.Permission, updateEndpointArgument.Permission.SplitReturnLast("_"));



            }
            else if (!string.IsNullOrWhiteSpace(updateEndpointArgument.Permission))
            {
                AddPermissionToAllowClass(Path.Combine(projectDir, setting.Project.AllowClassPath), updateEndpointArgument.Permission, false);
                AddPermissionToProvider(Path.Combine(projectDir, setting.Project.PermissionDefinitionProviderPath), argument.Group.Replace("Group", ""),
                    argument.PluralName, updateEndpointArgument.Permission, updateEndpointArgument.Permission.SplitReturnLast("_"));
            }



            await GenerateEndpoint(updateEndpointArgument, setting, endpointDir, entityNamespace, groupNamespace, dataContextNamespace);

            // list endpoint
            var listEndpointArgument = (EndpointArgument)argument.Clone();
            listEndpointArgument.Type = ArgumentType.ListEndpoint;
            listEndpointArgument.Method = "get";
            listEndpointArgument.BaseProperties = "true";
            listEndpointArgument.Name = Helpers.EndpointName(listEndpointArgument.Name, listEndpointArgument.Type);
            if (listEndpointArgument.Authorization.ToLower() == "true" && string.IsNullOrWhiteSpace(listEndpointArgument.Permission))
            {
                listEndpointArgument.Permission = Helpers.PermissionName(listEndpointArgument.Name);
                AddPermissionToAllowClass(Path.Combine(projectDir, setting.Project.AllowClassPath), listEndpointArgument.Permission, false);
                AddPermissionToProvider(Path.Combine(projectDir, setting.Project.PermissionDefinitionProviderPath), argument.Group.Replace("Group", ""),
                    argument.PluralName, listEndpointArgument.Permission, listEndpointArgument.Permission.SplitReturnLast("_"));



            }
            else if (!string.IsNullOrWhiteSpace(listEndpointArgument.Permission))
            {
                AddPermissionToAllowClass(Path.Combine(projectDir, setting.Project.AllowClassPath), listEndpointArgument.Permission, false);
                AddPermissionToProvider(Path.Combine(projectDir, setting.Project.PermissionDefinitionProviderPath), argument.Group.Replace("Group", ""),
                    argument.PluralName, listEndpointArgument.Permission, listEndpointArgument.Permission.SplitReturnLast("_"));
            }



            await GenerateEndpoint(listEndpointArgument, setting, endpointDir, entityNamespace, groupNamespace, dataContextNamespace);

            // get endpoint
            var getEndpointArgument = (EndpointArgument)argument.Clone();
            getEndpointArgument.Type = ArgumentType.GetEndpoint;
            getEndpointArgument.Method = "get";
            getEndpointArgument.BaseProperties = "true";
            getEndpointArgument.Name = Helpers.EndpointName(getEndpointArgument.Name, getEndpointArgument.Type);
            if (getEndpointArgument.Authorization.ToLower() == "true" && string.IsNullOrWhiteSpace(getEndpointArgument.Permission))
            {
                getEndpointArgument.Permission = Helpers.PermissionName(getEndpointArgument.Name);
                AddPermissionToAllowClass(Path.Combine(projectDir, setting.Project.AllowClassPath), getEndpointArgument.Permission, false);
                AddPermissionToProvider(Path.Combine(projectDir, setting.Project.PermissionDefinitionProviderPath), argument.Group.Replace("Group", ""),
                    argument.PluralName, getEndpointArgument.Permission, getEndpointArgument.Permission.SplitReturnLast("_"));



            }
            else if (!string.IsNullOrWhiteSpace(getEndpointArgument.Permission))
            {
                AddPermissionToAllowClass(Path.Combine(projectDir, setting.Project.AllowClassPath), getEndpointArgument.Permission, false);
                AddPermissionToProvider(Path.Combine(projectDir, setting.Project.PermissionDefinitionProviderPath), argument.Group.Replace("Group", ""),
                    argument.PluralName, getEndpointArgument.Permission, getEndpointArgument.Permission.SplitReturnLast("_"));
            }



            await GenerateEndpoint(getEndpointArgument, setting, endpointDir, entityNamespace, groupNamespace, dataContextNamespace);

            // delete endpoint
            var deleteEndpointArgument = (EndpointArgument)argument.Clone();
            deleteEndpointArgument.Type = ArgumentType.DeleteEndpoint;
            deleteEndpointArgument.Method = "delete";
            deleteEndpointArgument.Name = Helpers.EndpointName(deleteEndpointArgument.Name, deleteEndpointArgument.Type);
            if (deleteEndpointArgument.Authorization.ToLower() == "true" && string.IsNullOrWhiteSpace(deleteEndpointArgument.Permission))
            {
                deleteEndpointArgument.Permission = Helpers.PermissionName(deleteEndpointArgument.Name);
                AddPermissionToAllowClass(Path.Combine(projectDir, setting.Project.AllowClassPath), deleteEndpointArgument.Permission, false);
                AddPermissionToProvider(Path.Combine(projectDir, setting.Project.PermissionDefinitionProviderPath), argument.Group.Replace("Group", ""),
                    argument.PluralName, deleteEndpointArgument.Permission, deleteEndpointArgument.Permission.SplitReturnLast("_"));



            }
            else if (!string.IsNullOrWhiteSpace(deleteEndpointArgument.Permission))
            {
                AddPermissionToAllowClass(Path.Combine(projectDir, setting.Project.AllowClassPath), deleteEndpointArgument.Permission, false);
                AddPermissionToProvider(Path.Combine(projectDir, setting.Project.PermissionDefinitionProviderPath), argument.Group.Replace("Group", ""),
                    argument.PluralName, deleteEndpointArgument.Permission, deleteEndpointArgument.Permission.SplitReturnLast("_"));
            }



            await GenerateEndpoint(deleteEndpointArgument, setting, endpointDir, entityNamespace, groupNamespace, dataContextNamespace);
        }
        else
        {
            var endpointDir = GetEndpointDir(projectDir, setting.Project.EndpointPath, argument.Output);
            if (!Directory.Exists(endpointDir))
                Directory.CreateDirectory(endpointDir);

            var entityNamespace = GetClassNamespace(projectDir, setting.Project.Name, argument.Entity);
            var groupNamespace = GetClassNamespace(projectDir, setting.Project.Name, argument.Group);
            var dataContextNamespace = GetClassNamespace(projectDir, setting.Project.Name, argument.DataContext);

            if (argument.Authorization.ToLower() == "true" && string.IsNullOrWhiteSpace(argument.Permission))
            {
                argument.Permission = Helpers.PermissionName(argument.Name);
                AddPermissionToAllowClass(Path.Combine(projectDir, setting.Project.AllowClassPath), argument.Permission);
                AddPermissionToProvider(Path.Combine(projectDir, setting.Project.PermissionDefinitionProviderPath), argument.Group?.Replace("Group", ""),
                    argument.PluralName, argument.Permission, argument.Permission.SplitReturnLast("_"));


            }
            else if (!string.IsNullOrWhiteSpace(argument.Permission))
            {
                AddPermissionToAllowClass(Path.Combine(projectDir, setting.Project.AllowClassPath), argument.Permission);
                AddPermissionToProvider(Path.Combine(projectDir, setting.Project.PermissionDefinitionProviderPath), argument.Group?.Replace("Group", ""),
                    argument.PluralName, argument.Permission, argument.Permission.SplitReturnLast("_"));

            }
            await GenerateEndpoint(argument, setting, endpointDir, entityNamespace, groupNamespace, dataContextNamespace);
        }
    }

    #region Helpers

    private async Task GenerateEndpoint(EndpointArgument argument, FeToolSetting setting, string endpointDir, string entityNamespace,
        string groupNamespace, string dataContextNamespace)
    {
        var fileName = $"{argument.Name}Endpoint.cs";
        var filePath = Path.Combine(endpointDir, fileName);

        var template = GenerateEndpointCode(argument, setting, entityNamespace, groupNamespace, dataContextNamespace);

        if (File.Exists(filePath))
        {
            Console.Write($"File {fileName} already exists. Do you want to overwrite it? (y/n): ");
            var response = Console.ReadLine()?.ToLower();
            if (response == "y")
            {
                await File.WriteAllTextAsync(filePath, template);
                Console.WriteLine($"{fileName} file overwritten under {endpointDir}");
                return;
            }
            else
            {
                Console.WriteLine($"Skipping {fileName}");
                return;
            }
        }
        await File.WriteAllTextAsync(filePath, template);
        Console.WriteLine($"{fileName} file created under {endpointDir}");
    }

    private async Task GenerateCrudGroup(EndpointArgument argument, FeToolSetting setting, string endpointDir)
    {
        var fileName = $"{argument.PluralName}Group.cs";
        var filePath = Path.Combine(endpointDir, fileName);

        var template = GenerateCrudGroupCode(argument, setting);

        if (File.Exists(filePath))
        {
            Console.Write($"File {fileName} already exists. Do you want to overwrite it? (y/n): ");
            var response = Console.ReadLine()?.ToLower();
            if (response == "y")
            {
                await File.WriteAllTextAsync(filePath, template);
                Console.WriteLine($"{fileName} file overwritten under {endpointDir}");
                return;
            }
            else
            {
                Console.WriteLine($"Skipping {fileName}");
                return;
            }
        }
        await File.WriteAllTextAsync(filePath, template);
        Console.WriteLine($"{fileName} file created under {endpointDir}");
    }

    private string GenerateEndpointCode(EndpointArgument argument, FeToolSetting setting, string entityNamespace,
        string groupNamespace, string dataContextNamespace)
    {
        var templateBuilder = new StringBuilder();

        argument.EntityFullName = $"{entityNamespace}{(!string.IsNullOrWhiteSpace(entityNamespace) ? "." : string.Empty)}{argument.Entity}";
        argument.GroupFullName = $"{groupNamespace}{(!string.IsNullOrWhiteSpace(groupNamespace) ? "." : string.Empty)}{argument.Group}";
        argument.DataContextFullName = $"{dataContextNamespace}{(!string.IsNullOrWhiteSpace(dataContextNamespace) ? "." : string.Empty)}{argument.DataContext}";

        var namespaces = new List<string?>
        {
            "FastEndpoints",
            "FluentValidation",
            setting.Project.PermissionsNamespace,
            entityNamespace,
            groupNamespace,
            dataContextNamespace
        };
        var endpointNamespace = GetEndpointNamespace(setting.Project.RootNamespace, setting.Project.EndpointPath, argument.Output);
        var uniqueNamespaces = namespaces
            .Where(x => !string.IsNullOrWhiteSpace(x) && x != endpointNamespace)
            .Select(x => x!)
            .Distinct()
            .ToList();

        argument.UsingNamespaces = uniqueNamespaces;
        argument.Namespace = endpointNamespace;

        var templateType = GetTypesImplementingInterface(typeof(ITemplate<>))
            .Where(t => t.Name == $"{argument.Type}Template")
            .SingleOrDefault();
        if (templateType == null)
            throw new Exception($"{argument.Type}Template class not found.");
        var templateObj = Activator.CreateInstance(templateType);
        var templateMethod = templateType.GetMethod("Template");
        if (templateMethod == null)
            throw new Exception($"{templateType.FullName} not implement Template method.");
        var templateResult = templateMethod.Invoke(templateObj, [argument]);
        var templateText = templateResult as string;
        if (string.IsNullOrWhiteSpace(templateText))
            throw new Exception($"{templateType.FullName}.{templateMethod.Name} return empty template.");
        templateBuilder.AppendLine(templateText);

        return templateBuilder.ToString();
    }

    private string GenerateCrudGroupCode(EndpointArgument argument, FeToolSetting setting)
    {
        var templateBuilder = new StringBuilder();

        var endpointNamespace = GetEndpointNamespace(setting.Project.RootNamespace, setting.Project.EndpointPath, argument.Output);

        argument.UsingNamespaces = new List<string> { "FastEndpoints" };
        argument.Namespace = endpointNamespace;

        var templateType = GetTypesImplementingInterface(typeof(ITemplate<>))
            .Where(t => t.Name == "CrudGroupTemplate")
            .SingleOrDefault();
        if (templateType == null)
            throw new Exception("CrudGroupTemplate class not found.");
        var templateObj = Activator.CreateInstance(templateType);
        var templateMethod = templateType.GetMethod("Template");
        if (templateMethod == null)
            throw new Exception($"{templateType.FullName} not implement Template method.");
        var templateResult = templateMethod.Invoke(templateObj, [argument]);
        var templateText = templateResult as string;
        if (string.IsNullOrWhiteSpace(templateText))
            throw new Exception($"{templateType.FullName}.{templateMethod.Name} return empty template.");
        templateBuilder.AppendLine(templateText);

        return templateBuilder.ToString();
    }


    private IEnumerable<Type> GetTypesImplementingInterface(Type genericInterfaceType)
    {
        return Assembly.GetExecutingAssembly().GetTypes()
            .Where(t => t.GetInterfaces()
                         .Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == genericInterfaceType));
    }

    #endregion
}
