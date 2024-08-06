namespace FastEndpointsTool.Parsing;

public class Parser
{
    public Argument Parse(string[] args)
    {
        if (args.Length < 2)
            throw new Exception($"Invalidate arguments.");

        var endpointArgument = new EndpointArgumentParser().Parse(args);
        if (endpointArgument != null)
            return endpointArgument;

        throw new Exception($"Invalidate arguments.");
    }
}

