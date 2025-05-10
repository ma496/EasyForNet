using Backend.Data.Entities.Base;

namespace Backend.Data.Entities.Identity;

public class User : AuditableEntity<Guid>, IHasNormalizedProperties
{
    public bool Default { get; set; }
    public string Username { get; set; } = null!;
    public string UsernameNormalized { get; private set; } = null!;
    public string Email { get; set; } = null!;
    public string EmailNormalized { get; private set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
    public Image? Image { get; set; }

    public ICollection<UserRole> UserRoles { get; set; } = [];
    public ICollection<AuthToken> AuthTokens { get; set; } = [];
    public ICollection<Token> Tokens { get; set; } = [];

    public void NormalizeProperties()
    {
        UsernameNormalized = Username.ToLowerInvariant();
        EmailNormalized = Email.ToLowerInvariant();
    }
}