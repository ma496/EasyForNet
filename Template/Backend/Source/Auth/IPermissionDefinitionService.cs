namespace Backend.Auth;

public interface IPermissionDefinitionService
{
    IReadOnlyList<FlattenedPermission> GetFlattenedPermissions();
}
