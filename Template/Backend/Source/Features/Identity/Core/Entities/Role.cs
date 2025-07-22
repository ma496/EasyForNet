using Backend.Data.Entities.Base;

namespace Backend.Features.Identity.Core.Entities;

public class Role : AuditableEntity<Guid>, IHasNormalizedProperties
{
    public bool Default { get; set; }
    public string Name { get; set; } = null!;
    public string NameNormalized { get; private set; } = null!;
    public string? Description { get; set; }

    public ICollection<UserRole> UserRoles { get; set; } = [];
    public ICollection<RolePermission> RolePermissions { get; set; } = [];

    public void NormalizeProperties()
    {
        NameNormalized = Name.ToLowerInvariant();
    }
}