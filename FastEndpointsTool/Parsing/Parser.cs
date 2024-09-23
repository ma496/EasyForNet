using FastEndpointsTool.Parsing.Endpoint;

namespace FastEndpointsTool.Parsing;

public class Parser
{
    public Argument Parse(string[] args)
    {
        var endpointArgument = new EndpointArgumentParser().Parse(args);
        if (endpointArgument != null)
            return endpointArgument;

        throw new Exception($"Invalidate arguments.");
    }
}

