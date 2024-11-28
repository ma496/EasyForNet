using FastEndpointsTool.Parsing;

namespace FastEndpointsTool.Generator;

public class CreateProjectGenerator : CodeGeneratorBase<CreateProjectArgument>
{
    public override async Task Generate(CreateProjectArgument argument)
    {
        var directory = Directory.GetCurrentDirectory();
        var (setting, projectDir) = await Helpers.GetSetting(directory);
    }
}
