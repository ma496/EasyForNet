namespace Backend.Permissions;

public class PermissionDefinitionProvider
{
    public void Define(PermissionDefinitionContext context)
    {
        var identityPermissions = context.AddPermission("Identity", "Identity");

        var usersPermissions = identityPermissions.AddChild("Users", "Users");
        usersPermissions.AddChild(Allow.User_View, "View");
        usersPermissions.AddChild(Allow.User_Create, "Create");
        usersPermissions.AddChild(Allow.User_Update, "Update");
        usersPermissions.AddChild(Allow.User_Delete, "Delete");

        var rolesPermissions = identityPermissions.AddChild("Roles", "Roles");
        rolesPermissions.AddChild(Allow.Role_View, "View");
        rolesPermissions.AddChild(Allow.Role_Create, "Create");
        rolesPermissions.AddChild(Allow.Role_Update, "Update");
        rolesPermissions.AddChild(Allow.Role_Delete, "Delete");
        rolesPermissions.AddChild(Allow.Role_ChangePermissions, "ChangePermissions");
    }
}
