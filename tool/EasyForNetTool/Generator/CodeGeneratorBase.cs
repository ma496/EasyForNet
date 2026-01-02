namespace EasyForNetTool.Generator;

using EasyForNetTool.Parsing;

public abstract class CodeGeneratorBase<TArgument>
    where TArgument : Argument
{
    public abstract Task Generate(TArgument argument);
}

