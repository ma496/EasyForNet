using FastEndpointsTool.Parsing.Endpoint;

namespace FastEndpointsTool.Parsing;

public class Parser
{
    public Argument Parse(string[] args)
    {
        var endpointArgument = new EndpointArgumentParser().Parse(args);

        return endpointArgument;
    }
}

