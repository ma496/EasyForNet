using Backend.Data.Entities.Base;

namespace Backend.Features.Identity.Core.Entities;

public class RolePermission : AuditableEntity
{
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;

    public Guid PermissionId { get; set; }
    public Permission Permission { get; set; } = null!;
}