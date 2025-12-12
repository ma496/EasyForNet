namespace Backend.Features.Identity.Core.Entities;

using Backend.Data.Entities.Base;

public class Permission : AuditableEntity<Guid>
{
    public string Name { get; set; } = null!;
    public string DisplayName { get; set; } = null!;

    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}