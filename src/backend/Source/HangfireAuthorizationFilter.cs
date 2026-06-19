namespace Backend;

using Hangfire.Dashboard;

/// <summary>
/// Restricts the Hangfire dashboard to authenticated users that belong to
/// the <c>Admin</c> role.
/// </summary>
public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    /// <summary>
    /// Grants dashboard access only when the request is from an
    /// authenticated user in the <c>Admin</c> role; returns <c>false</c> for
    /// everyone else.
    /// </summary>
    /// <param name="context">The current Hangfire dashboard context.</param>
    /// <returns><c>true</c> if the request should be allowed; otherwise <c>false</c>.</returns>
    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();

        // Check if the user is authenticated
        if (!httpContext.User.Identity?.IsAuthenticated ?? true)
        {
            return false;
        }

        // check for admin role
        return httpContext.User.IsInRole("Admin");
    }
}
