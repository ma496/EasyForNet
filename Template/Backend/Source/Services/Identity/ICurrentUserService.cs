namespace Backend.Services.Identity;

public interface ICurrentUserService
{
    Guid? GetCurrentUserId();
    string? GetCurrentUsername();
    string? GetCurrentEmail();
    bool IsAuthenticated();
    bool IsInRole(string role);
    bool HasPermission(string permission);
    IEnumerable<string> GetCurrentUserRoles();
    IEnumerable<string> GetCurrentUserPermissions();
} 