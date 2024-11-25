using Backend.Data.Entities.Base;

namespace Backend.Data.Entities.Identity;

public class Role : BaseEntity<Guid>, IExcludeProperties
{
    public bool Default { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();

    public static List<string> ExcludeProperties()
    {
        return [
            nameof(Default)
        ];
    }

}