namespace Backend.Auth;

public class PermissionDefinitionService : IPermissionDefinitionService
{
    private readonly PermissionDefinitionContext _context;

    public PermissionDefinitionService(PermissionDefinitionContext context)
    {
        _context = context;
    }

    public IReadOnlyList<FlattenedPermission> GetFlattenedPermissions()
    {
        return _context.Permissions.SelectMany(GetPermissions).ToList();
    }

    #region Helpers

    private IEnumerable<FlattenedPermission> GetPermissions(PermissionDefinition permission)
    {
        yield return new FlattenedPermission
        {
            Name = permission.Name,
            DisplayName = permission.DisplayName
        };

        foreach (var child in permission.Children)
        {
            foreach (var flattenedPermission in GetPermissions(child))
            {
                yield return flattenedPermission;
            }
        }
    }

    #endregion
}

public class FlattenedPermission
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
}
