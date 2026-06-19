namespace EasyForNetTool.Parsing;

/// <summary>
/// Entry-point parser that delegates to the appropriate sub-parser for the given arguments.
/// </summary>
public class Parser
{
    /// <summary>
    /// Parses the raw CLI arguments by delegating to <see cref="ArgumentParser"/>.
    /// </summary>
    public Argument Parse(string[] args)
    {
        var argument = new ArgumentParser().Parse(args);

        return argument;
    }
}

