namespace Backend.Permissions;

using Backend.Attributes;

public interface IPermissionDefinitionService
{
    IReadOnlyList<PermissionDefinition> GetPermissions();
    IReadOnlyList<FlattenedPermission> GetFlattenedPermissions();
}

[NoDirectUse]
public class PermissionDefinitionService(PermissionDefinitionContext context) : IPermissionDefinitionService
{
    public IReadOnlyList<PermissionDefinition> GetPermissions() => context.GetPermissions();

    public IReadOnlyList<FlattenedPermission> GetFlattenedPermissions()
    {
        return GetPermissions().SelectMany(GetPermissions).ToList();
    }

    #region Helpers

    private IEnumerable<FlattenedPermission> GetPermissions(PermissionDefinition permission)
    {
        if (!permission.Children.Any())
        {
            yield return new FlattenedPermission
            {
                Name = permission.Name,
                DisplayName = permission.DisplayName
            };
            yield break;
        }

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
    public string Name { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
}
