namespace FastEndpointsTool.Parsing.Endpoint;

public class EndpointArgument : Argument, ICloneable
{
    public EndpointType Type { get; set; }
    public string Name { get; set; } = null!;
    public string Method { get; set; } = null!;
    public string Url { get; set; } = null!;
    public string Entity { get; set; } = null!;
    public string EntityFullName { get; set; } = null!;
    public string Output { get; set; } = null!;
    public string Group { get; set; } = null!;
    public string GroupFullName { get; set; } = null!;
    public string PluralName { get; set; } = null!;
    public string DataContext { get; set; } = null!;
    public string DataContextFullName { get; set; } = null!;
    public string Namespace { get; set; } = null!;
    public List<string> UsingNamespaces { get; set; } = new();
    
    public object Clone()
    {
        return MemberwiseClone();
    }
}

