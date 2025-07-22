using System.Text.Json.Serialization;

namespace Backend.Permissions;

public class PermissionDefinition(string name, string displayName)
{
    public string Name { get; set; } = name;
    public string DisplayName { get; set; } = displayName;

    [JsonIgnore]
    public PermissionDefinition? Parent { get; set; }
    public IList<PermissionDefinition> Children { get; set; } = [];

    public PermissionDefinition AddChild(string name, string displayName)
    {
        var child = new PermissionDefinition(name, displayName)
        {
            Parent = this
        };
        Children.Add(child);
        return child;
    }
}
