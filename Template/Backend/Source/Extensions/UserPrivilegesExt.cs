using System.Security.Claims;
using Backend.Data.Entities.Identity;
using Backend.Services.Identity;

namespace Backend.Extensions;

public static class UserPrivilegesExt
{
    public static void AddUserClaims(this UserPrivileges privileges, User user, List<string> roles, List<string> permissions)
    {
        privileges.Claims.Add(new Claim(ClaimConstants.UserId, user.Id.ToString()));
        privileges.Claims.Add(new Claim(ClaimConstants.Username, user.Username));
        privileges.Claims.Add(new Claim(ClaimConstants.Email, user.Email));
        privileges.Claims.AddRange(roles.Select(r => new Claim(ClaimConstants.Role, r)));
        privileges.Claims.AddRange(permissions.Select(p => new Claim(ClaimConstants.Permission, p)));
    }
}
    