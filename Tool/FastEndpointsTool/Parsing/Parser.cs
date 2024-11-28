namespace FastEndpointsTool.Parsing;

public class Parser
{
    public Argument Parse(string[] args)
    {
        var endpointArgument = new ArgumentParser().Parse(args);

        return endpointArgument;
    }
}

