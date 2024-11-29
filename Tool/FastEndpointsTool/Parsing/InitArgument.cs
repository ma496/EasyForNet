namespace FastEndpointsTool.Parsing;

public class InitArgument : Argument
{
    public string Directory { get; set; } = null!;
    public string ProjectName { get; set; } = null!;
    public string? RootNamespace { get; set; }
}
