using System.Security.Claims;

namespace Backend.Services.Identity;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private ClaimsPrincipal? _user;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
        _user = _httpContextAccessor.HttpContext?.User;
    }

    public Guid? GetCurrentUserId()
    {
        var userIdClaim = _user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return userIdClaim != null ? Guid.Parse(userIdClaim) : null;
    }

    public string? GetCurrentUsername()
    {
        return _user?.FindFirst(ClaimTypes.Name)?.Value;
    }

    public string? GetCurrentEmail()
    {
        return _user?.FindFirst(ClaimTypes.Email)?.Value;
    }

    public bool IsAuthenticated()
    {
        return _user?.Identity?.IsAuthenticated ?? false;
    }

    public bool IsInRole(string role)
    {
        return _user?.IsInRole(role) ?? false;
    }

    public bool HasPermission(string permission)
    {
        var permissions = GetCurrentUserPermissions();
        return permissions.Contains(permission);
    }

    public IEnumerable<string> GetCurrentUserRoles()
    {
        var roles = _user?.FindAll(ClaimTypes.Role).Select(x => x.Value);
        return roles ?? Enumerable.Empty<string>();
    }

    public IEnumerable<string> GetCurrentUserPermissions()
    {
        var permissions = _user?.FindAll(ClaimConstants.Permission).Select(x => x.Value);
        return permissions ?? Enumerable.Empty<string>();
    }
}