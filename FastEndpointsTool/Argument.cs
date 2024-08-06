namespace FastEndpointsTool;

public class Argument
{
    public string Name { get; set; } = null!;
    public string ShortName { get; set; } = null!;
    public string Description { get; set; } = null!;
    public IList<ArgumentOption> Options { get; set; } = null!;
}

public class ArgumentOption
{
    public string Name { get; set; } = null!;
    public string ShortName { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Value { get; set; } = null!;
    public string Output { get; set; } = null !;
}
