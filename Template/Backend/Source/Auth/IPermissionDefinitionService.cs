namespace Backend.Auth;

public interface IPermissionDefinitionService
{
    IReadOnlyList<PermissionDefinition> GetPermissions();
    IReadOnlyList<FlattenedPermission> GetFlattenedPermissions();
}
