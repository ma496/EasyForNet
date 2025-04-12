using Backend.Data.Entities.Base;

namespace Backend.Data.Entities.Identity;

public class Role : AuditableEntity<Guid>
{
    public bool Default { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}