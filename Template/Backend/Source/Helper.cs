using System.Security.Claims;
using Backend.Data.Entities.Identity;
using Backend.Services.Identity;

namespace Backend;

public static class Helper
{
    public static List<Claim> CreateClaims(User user, List<string> roles, List<string> permissions)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
        };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));
        claims.AddRange(permissions.Select(p => new Claim(ClaimConstants.Permission, p)));
        return claims;
    }

    private static long _lastNumber = 0;
    private static readonly Lock _lock = new();

    public static long UniqueNumber()
    {
        lock (_lock)
        {
            return ++_lastNumber;
        }
    }
}
