namespace Backend.Permissions;

using Backend.Attributes;

public interface IPermissionDefinitionService
{
    IReadOnlyList<PermissionGroupDefinition> GetPermissionGroups();
    IReadOnlyList<FlattenedPermission> GetFlattenedPermissions();
}

[NoDirectUse]
public class PermissionDefinitionService(IEnumerable<IPermissionDefinitionProvider> providers) : IPermissionDefinitionService
{
    public IReadOnlyList<PermissionGroupDefinition> GetPermissionGroups()
    {
        var groups = new List<PermissionGroupDefinition>();
        foreach (var provider in providers)
        {
            var context = new PermissionDefinitionContext();
            provider.Define(context);
            groups.Add(new PermissionGroupDefinition
            {
                GroupName = provider.GroupName,
                Permissions = context.GetPermissions()
            });
        }
        return groups.AsReadOnly();
    }

    public IReadOnlyList<FlattenedPermission> GetFlattenedPermissions()
    {
        var allPermissions = GetPermissionGroups().SelectMany(g => g.Permissions);
        return [.. allPermissions.SelectMany(GetPermissions)];
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
