namespace Backend;

using Hangfire.Dashboard;

public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
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
