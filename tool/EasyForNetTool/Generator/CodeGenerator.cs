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
        else if (argument is CreateFeatureArgument createFeatureArgument)
        {
            await new CreateFeatureGenerator().Generate(createFeatureArgument);
        }
        else
            throw new Exception($"Invalid argument type: {argument.Type}");
    }
}
