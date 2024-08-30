namespace FastEndpointsTool.Parsing;

public class EndpointArgument : Argument
{
    public EndpointType Type { get; set; }
    public string Name { get; set; } = null!;
    public string Method { get; set; } = null!;
    public string Url { get; set; } = null!;
    public string Entity { get; set; } = null!;
    public string Output { get; set; } = null!;
    public string Group { get; set; } = null!;
}

public enum EndpointType
{
    Endpoint = 1,
    EndpointWithoutMapper = 2,
    EndpointWithoutResponse = 3,
    EndpointWithoutRequest = 4,
    EndpointWithoutResponseAndRequest = 5,
}

