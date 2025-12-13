using EasyForNetTool.Parsing;

namespace EasyForNetTool.Generator;

public abstract class CodeGeneratorBase<TArgument>
    where TArgument : Argument
{
    public abstract Task Generate(TArgument argument);
}

