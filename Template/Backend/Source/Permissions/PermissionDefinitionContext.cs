namespace Backend.Permissions;

public class PermissionDefinitionContext
{
    private IList<PermissionDefinition> Permissions { get; } = [];

    public PermissionDefinition AddPermission(string name, string displayName)
    {
        var permission = new PermissionDefinition(name, displayName);
        Permissions.Add(permission);
        return permission;
    }

    public IReadOnlyList<PermissionDefinition> GetPermissions() => Permissions.AsReadOnly();
}
