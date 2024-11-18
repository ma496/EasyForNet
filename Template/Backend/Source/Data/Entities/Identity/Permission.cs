using Backend.Data.Entities.Base;

namespace Backend.Data.Entities.Identity;

public class Permission : BaseEntity<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}