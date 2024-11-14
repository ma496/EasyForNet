using Backend.Data.Entities.Base;

namespace Backend.Data.Entities.Identity;

public class UserRole : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;
}