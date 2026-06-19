namespace Backend.Permissions;

/// <summary>
/// Mutable builder context passed to <see cref="IPermissionDefinitionProvider"/>
/// implementations while they declare the permissions they contribute.
/// </summary>
public class PermissionDefinitionContext
{
    private IList<PermissionDefinition> _permissions { get; } = [];

    /// <summary>
    /// Adds a new top-level permission to the context.
    /// </summary>
    /// <param name="name">Stable permission name (e.g. <c>User.View</c>).</param>
    /// <param name="displayName">Human-readable name shown in the UI.</param>
    /// <returns>The created <see cref="PermissionDefinition"/> which can be used to add child permissions.</returns>
    public PermissionDefinition AddPermission(string name, string displayName)
    {
        var permission = new PermissionDefinition(name, displayName);
        _permissions.Add(permission);
        return permission;
    }

    /// <summary>
    /// Returns a read-only view of the permissions that have been added to this context.
    /// </summary>
    /// <returns>The permissions defined so far in this context.</returns>
    public IReadOnlyList<PermissionDefinition> GetPermissions()
    {
        return _permissions.AsReadOnly();
    }
}
