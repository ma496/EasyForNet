namespace EasyForNetTool.Parsing;

public class ArgumentParser : ParserBase
{
    public override Argument Parse(string[] args)
    {
        if (args[0] == "createproject" || args[0] == "cp")
        {
            var argument = new CreateProjectArgument { Type = ArgumentType.CreateProject };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.CreateProject, argument, options);

            return argument;
        }

        throw new UserFriendlyException($"{args[0]} is not a valid command.");
    }
}
