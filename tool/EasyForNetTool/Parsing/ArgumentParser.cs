namespace EasyForNetTool.Parsing;

/// <summary>
/// Parses CLI arguments into strongly-typed argument objects based on the command name.
/// </summary>
public class ArgumentParser : ParserBase
{
    /// <summary>
    /// Parses the raw CLI arguments and returns the appropriate typed argument.
    /// </summary>
    /// <param name="args">The raw command-line arguments.</param>
    /// <returns>A typed <see cref="Argument"/> instance (e.g., <see cref="CreateProjectArgument"/>).</returns>
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
