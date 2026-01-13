namespace Backend;

using System.Security.Claims;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;

public static class Helper
{
    public static void AddFeatures(IServiceCollection services, ConfigurationManager configuration)
    {
        var features = typeof(Helper).Assembly.GetTypes()
            .Where(p => typeof(IFeature).IsAssignableFrom(p) && !p.IsAbstract)
            .ToList();

        foreach (var feature in features)
        {
            feature.GetMethod("AddServices")?.Invoke(null, [services, configuration]);
        }
    }
    
    public static List<Claim> CreateClaims(User user, List<string> roles, List<string> permissions)
    {
        var claims = new List<Claim>
        {
            new (ClaimTypes.NameIdentifier, user.Id.ToString()),
            new (ClaimTypes.Name, user.Username),
            new (ClaimTypes.Email, user.Email),
        };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));
        claims.AddRange(permissions.Select(p => new Claim(ClaimConstants.Permission, p)));
        return claims;
    }
}
