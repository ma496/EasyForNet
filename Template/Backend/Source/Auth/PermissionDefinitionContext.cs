namespace Backend.Auth;

public class PermissionDefinitionContext
{
    private IList<PermissionDefinition> _permissions { get; } = [];

    public PermissionDefinition AddPermission(string name, string displayName)
    {
        var permission = new PermissionDefinition(name, displayName);
        _permissions.Add(permission);
        return permission;
    }

    public IReadOnlyList<PermissionDefinition> GetPermissions() => _permissions.AsReadOnly();
}
