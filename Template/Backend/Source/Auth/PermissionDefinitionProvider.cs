namespace Backend.Auth;

public class PermissionDefinitionProvider
{
    public void Define(PermissionDefinitionContext context)
    {
        var usersPermissions = context.AddPermission("Users", "Users");
        usersPermissions.AddChild(Allow.User_View, "View");
        usersPermissions.AddChild(Allow.User_Create, "Create");
        usersPermissions.AddChild(Allow.User_Update, "Update");
        usersPermissions.AddChild(Allow.User_Delete, "Delete");

        var rolesPermissions = context.AddPermission("Roles", "Roles");
        rolesPermissions.AddChild(Allow.Role_View, "View");
        rolesPermissions.AddChild(Allow.Role_Create, "Create");
        rolesPermissions.AddChild(Allow.Role_Update, "Update");
        rolesPermissions.AddChild(Allow.Role_Delete, "Delete");
        rolesPermissions.AddChild(Allow.Role_ChangePermissions, "ChangePermissions");
    }
}
