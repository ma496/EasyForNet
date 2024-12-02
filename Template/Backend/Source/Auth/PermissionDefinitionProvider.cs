namespace Backend.Auth;

public class PermissionDefinitionProvider
{
    public void Define(PermissionDefinitionContext context)
    {
        var usersPermission = context.AddPermission("Users", "Users");
        usersPermission.AddChild(Allow.User_View, "View");
        usersPermission.AddChild(Allow.User_Create, "Create");
        usersPermission.AddChild(Allow.User_Update, "Update");
        usersPermission.AddChild(Allow.User_Delete, "Delete");

        var rolesPermission = context.AddPermission("Roles", "Roles");
        rolesPermission.AddChild(Allow.Role_View, "View");
        rolesPermission.AddChild(Allow.Role_Create, "Create");
        rolesPermission.AddChild(Allow.Role_Update, "Update");
        rolesPermission.AddChild(Allow.Role_Delete, "Delete");
    }
}
