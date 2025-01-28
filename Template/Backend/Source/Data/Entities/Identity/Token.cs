using Backend.Data.Entities.Base;

namespace Backend.Data.Entities.Identity;

public class Token : AuditableEntity<Guid>
{
    public string Value { get; set; } = null!;
    public DateTime Expiry { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}