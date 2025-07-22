namespace Backend.Permissions;

public interface IPermissionDefinitionService
{
    IReadOnlyList<PermissionDefinition> GetPermissions();
    IReadOnlyList<FlattenedPermission> GetFlattenedPermissions();
}
