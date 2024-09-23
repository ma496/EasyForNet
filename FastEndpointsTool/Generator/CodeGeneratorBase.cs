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

    protected string? GetClassNamespace(string projectDir, string projectName, string className)
    {
        var assembly = Helpers.GetProjectAssembly(projectDir, projectName);
        var types = assembly.GetTypes()
            .Where(t => t.Name == className)
            .ToArray();

        if (types.Length == 0) return null;
        if (types.Length == 1) return types[0].Namespace;
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
            throw new Exception("input is not integer.");
        if (selectIndex >= 0 && selectIndex < index)
            return types[selectIndex].Namespace;
        throw new Exception("input number out of range");
    }

    protected string GetEndpointNamespace(string rootNamespace, string endpointPath, string output)
    {
        return $"{rootNamespace}.{endpointPath}" + (string.IsNullOrWhiteSpace(output) ? string.Empty : $".{output}");
    }
}
