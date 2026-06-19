namespace Backend.Permissions;

using System.Text.Json.Serialization;

/// <summary>
/// Describes a single permission and supports a tree of child permissions
/// used to model hierarchies such as <c>User.View</c> nested under
/// <c>User</c>.
/// </summary>
public class PermissionDefinition(string name, string displayName)
{
    public string Name { get; set; } = name;
    public string DisplayName { get; set; } = displayName;

    [JsonIgnore]
    public PermissionDefinition? Parent { get; set; }
    public IList<PermissionDefinition> Children { get; set; } = [];

    /// <summary>
    /// Creates and attaches a child permission beneath this one.
    /// </summary>
    /// <param name="name">Stable name of the child permission.</param>
    /// <param name="displayName">Display name of the child permission.</param>
    /// <returns>The newly created child <see cref="PermissionDefinition"/>.</returns>
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
