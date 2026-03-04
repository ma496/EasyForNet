namespace Backend.Permissions;

public interface IPermissionDefinitionProvider
{
    string GroupName { get; }
    void Define(PermissionDefinitionContext context);
}
