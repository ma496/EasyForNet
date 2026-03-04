namespace Backend.Permissions;

public class PermissionGroupDefinition
{
    public string GroupName { get; set; } = string.Empty;
    public IReadOnlyList<PermissionDefinition> Permissions { get; set; } = [];
}
