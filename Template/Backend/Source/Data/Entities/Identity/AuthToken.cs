using Backend.Data.Entities.Base;

namespace Backend.Data.Entities.Identity;

public class AuthToken : CreatableEntity<Guid>
{
    public string AccessToken { get; set; } = null!;
    public DateTime AccessExpiry { get; set; }
    public string RefreshToken { get; set; } = null!;
    public DateTime RefreshExpiry { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}
