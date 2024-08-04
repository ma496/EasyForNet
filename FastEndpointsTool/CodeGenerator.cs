using System.Text.Json;

namespace FastEndpointsTool;

public class CodeGenerator
{
    public void Generate(string[] args)
    {
        var argument = new Parser().Parse(args);

        if (argument is EndpointArgument endpointArgument)
        {
            Console.WriteLine(JsonSerializer.Serialize(endpointArgument));
        }
        else
            throw new Exception("Invalid args.");
    }
}
