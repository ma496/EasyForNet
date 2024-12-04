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
            new Claim(ClaimConstants.UserId, user.Id.ToString()),
            new Claim(ClaimConstants.Username, user.Username),
            new Claim(ClaimConstants.Email, user.Email),
        };
        claims.AddRange(roles.Select(r => new Claim(ClaimConstants.Role, r)));
        claims.AddRange(permissions.Select(p => new Claim(ClaimConstants.Permission, p)));
        return claims;
    }
}
