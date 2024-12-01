using Backend.Data.Entities.Base;

namespace Backend.Data.Entities.Identity;

public class User : AuditableEntity<Guid>, IExcludeProperties
{
    public bool Default { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }

    public ICollection<UserRole> UserRoles { get; set; } = [];
    public ICollection<AuthToken> AuthTokens { get; set; } = [];

    public static List<string> ExcludeProperties()
    {
        return new List<string>
        {
            nameof(Default),
            nameof(PasswordHash),
            nameof(LastLoginAt)
        };
    }
}