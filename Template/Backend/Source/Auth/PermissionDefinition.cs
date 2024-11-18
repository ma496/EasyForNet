namespace Backend.Auth;

public class PermissionDefinition
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;

    public PermissionDefinition? Parent { get; set; }
    public IList<PermissionDefinition> Children { get; set; } = [];

    public PermissionDefinition(string name, string displayName)
    {
        Name = name;
        DisplayName = displayName;
    }

    public PermissionDefinition AddChild(string name, string displayName)
    {
        var child = new PermissionDefinition(name, displayName);
        child.Parent = this;
        Children.Add(child);
        return child;
    }
}
