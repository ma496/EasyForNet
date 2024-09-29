using FastEndpointsTool.Parsing.Endpoint;
using FastEndpointsTool.Templates;
using System.Reflection;
using System.Text;

namespace FastEndpointsTool.Generator;

public class EndpointGenerator : CodeGeneratorBase<EndpointArgument>
{
    public override async Task Generate(EndpointArgument argument)
    {
        var directory = Directory.GetCurrentDirectory();
        var (setting, projectDir) = await Helpers.GetSetting(directory);
        var fileName = $"{Helpers.EndpointName(argument.Name, argument.Type)}Endpoint.cs";
        var endpointDir = GetEndpointDir(projectDir, setting.Project.EndpointPath, argument.Output);
        if (!Directory.Exists(endpointDir))
            Directory.CreateDirectory(endpointDir);
        var filePath = Path.Combine(endpointDir, fileName);

        var templateBuilder = new StringBuilder();

        var entityNamespace = GetClassNamespace(projectDir, setting.Project.Name, argument.Entity);
        var groupNamespace = GetClassNamespace(projectDir, setting.Project.Name, argument.Group);
        argument.EntityFullName = $"{entityNamespace}.{argument.Entity}";
        argument.GroupFullName = $"{groupNamespace}.{argument.Group}";

        var namespaces = new List<string?>
        {
            entityNamespace,
            groupNamespace
        };
        var endpointNamespace = GetEndpointNamespace(setting.Project.RootNamespace, setting.Project.EndpointPath, argument.Output);
        var uniqueNamespaces = namespaces
            .Where(x => !string.IsNullOrWhiteSpace(x) && x != endpointNamespace)
            .Distinct()
            .ToList();
        var lastNamespaceIndex = uniqueNamespaces.Count - 1;
        var currentNamespaceIndex = 0;
        uniqueNamespaces.ForEach(x =>
        {
            templateBuilder.AppendLine($"using {x};{(currentNamespaceIndex == lastNamespaceIndex ? Environment.NewLine : "")}");
            currentNamespaceIndex++;
        });

        templateBuilder.AppendLine($"namespace {endpointNamespace};");

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

        var template = templateBuilder.ToString();
        await File.WriteAllTextAsync(filePath, template);

        Console.WriteLine($"{fileName} file created under {endpointDir}");
    }

    static IEnumerable<Type> GetTypesImplementingInterface(Type genericInterfaceType)
    {
        return Assembly.GetExecutingAssembly().GetTypes()
            .Where(t => t.GetInterfaces()
                         .Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == genericInterfaceType));
    }
}
