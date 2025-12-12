namespace Backend.Features.Identity.Core.Entities;

using Backend.Data.Entities.Base;

public class UserRole : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;
}