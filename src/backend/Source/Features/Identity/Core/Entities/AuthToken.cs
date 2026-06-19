namespace Backend.Features.Identity.Core.Entities;

using Backend.Data.Entities.Base;

/// <summary>
/// Server-side record of an issued JWT access/refresh token pair, used to validate refresh requests and revoke tokens.
/// </summary>
public class AuthToken : CreatableEntity<Guid>
{
    public string AccessToken { get; set; } = null!;
    public DateTime AccessExpiry { get; set; }
    public string RefreshToken { get; set; } = null!;
    public DateTime RefreshExpiry { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}
