using FastEndpointsTool.Parsing;

namespace FastEndpointsTool.Generator;

public class InitGenerator : CodeGeneratorBase<InitArgument>
{
    public override async Task Generate(InitArgument argument)
    {
        await FetHelper.CreateFetFile(argument.Directory, argument.ProjectName,
            argument.RootNamespace ?? argument.ProjectName, Directory.GetCurrentDirectory());
    }
}
