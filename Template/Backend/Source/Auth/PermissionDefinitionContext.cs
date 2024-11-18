namespace Backend.Auth;

public class PermissionDefinitionContext
{
    public IList<PermissionDefinition> Permissions { get; } = [];

    public PermissionDefinition AddPermission(string name, string displayName)
    {
        var permission = new PermissionDefinition(name, displayName);
        Permissions.Add(permission);
        return permission;
    }
}
