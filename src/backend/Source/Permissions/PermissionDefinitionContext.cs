namespace Backend.Permissions;

public class PermissionDefinitionContext
{
    private IList<PermissionDefinition> _permissions { get; } = [];

    public PermissionDefinition AddPermission(string name, string displayName)
    {
        var permission = new PermissionDefinition(name, displayName);
        _permissions.Add(permission);
        return permission;
    }

    public IReadOnlyList<PermissionDefinition> GetPermissions()
    {
        var filteredPermissions = new List<PermissionDefinition>();

        foreach (var permission in _permissions)
        {
            if (permission.Include)
            {
                FilterChildren(permission);
                filteredPermissions.Add(permission);
            }
        }

        return filteredPermissions.AsReadOnly();
    }

    private static void FilterChildren(PermissionDefinition permission)
    {
        var includedChildren = new List<PermissionDefinition>();

        foreach (var child in permission.Children)
        {
            if (child.Include)
            {
                FilterChildren(child);
                includedChildren.Add(child);
            }
        }

        permission.Children = includedChildren;
    }
}
