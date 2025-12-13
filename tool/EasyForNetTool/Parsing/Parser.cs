namespace EasyForNetTool.Parsing;

public class Parser
{
    public Argument Parse(string[] args)
    {
        var argument = new ArgumentParser().Parse(args);

        return argument;
    }
}

