using EasyForNetTool.Parsing;

namespace EasyForNetTool.Generator;

public class CodeGenerator
{
    public async Task Generate(Argument argument)
    {
        if (argument is CreateProjectArgument createProjectArgument)
        {
            await new CreateProjectGenerator().Generate(createProjectArgument);
        }
        else
            throw new Exception($"Invalid argument type: {argument.Type}");
    }
}
