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
    }
}
