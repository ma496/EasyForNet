using FastEndpointsTool.Parsing;
using FastEndpointsTool.Parsing.Endpoint;

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
            throw new UserFriendlyException("Invalid args.");
    }
}
