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

        if (args[0] == "createfeature" || args[0] == "cf")
        {
            var argument = new CreateFeatureArgument { Type = ArgumentType.CreateFeature };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.CreateFeature, argument, options);

            return argument;
        }

        throw new UserFriendlyException($"{args[0]} is not a valid command.");
    }
}
