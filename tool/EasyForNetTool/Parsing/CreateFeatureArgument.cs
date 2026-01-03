namespace EasyForNetTool.Parsing;

public class CreateFeatureArgument : Argument
{
    public string Name { get; set; } = null!;
    public string? Project { get; set; }
    public string? Output { get; set; }
}
