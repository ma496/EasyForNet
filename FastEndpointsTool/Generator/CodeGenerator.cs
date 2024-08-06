using FastEndpointsTool.Parsing;

namespace FastEndpointsTool.Generator;

public class CodeGenerator
{
    public async Task Generate(Argument argument)
    {
        if (argument is EndpointArgument endpointArgument)
        {
            await new EndpointGenerator().Generate(endpointArgument);
        }
        else
            throw new Exception("Invalid args.");
    }
}
