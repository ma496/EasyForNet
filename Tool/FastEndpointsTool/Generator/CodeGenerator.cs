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
        else if (argument is CreateProjectArgument createProjectArgument)
        {
            await new CreateProjectGenerator().Generate(createProjectArgument);
        }
        else if (argument is InitArgument initArgument)
        {
            await new InitGenerator().Generate(initArgument);
        }
        else
            throw new Exception($"Invalid argument type: {argument.Type}");
    }
}
