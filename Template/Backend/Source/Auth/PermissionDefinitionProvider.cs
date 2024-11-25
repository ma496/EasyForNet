namespace Backend.Auth;

public class PermissionDefinitionProvider
{
    public void Define(PermissionDefinitionContext context)
    {
        var usersPermission = context.AddPermission("Users", "Users");
        usersPermission.AddChild(Allow.Users_View, "View");
        usersPermission.AddChild(Allow.Users_Create, "Create");
        usersPermission.AddChild(Allow.Users_Update, "Update");
        usersPermission.AddChild(Allow.Users_Delete, "Delete");

        var rolesPermission = context.AddPermission("Roles", "Roles");
        rolesPermission.AddChild(Allow.Roles_View, "View");
        rolesPermission.AddChild(Allow.Roles_Create, "Create");
        rolesPermission.AddChild(Allow.Roles_Update, "Update");
        rolesPermission.AddChild(Allow.Roles_Delete, "Delete");
    }
}
