namespace Backend.Features.Notifications.Endpoints.Notifications;

using Microsoft.EntityFrameworkCore;

/// <summary>
/// GET endpoint that returns the distinct set of notification group names used for filtering in the UI.
/// </summary>
sealed class NotificationGetGroupsEndpoint(AppDbContext dbContext) : EndpointWithoutRequest<NotificationGetGroupsResponse>
{
    public override void Configure()
    {
        Get("groups");
        Group<NotificationsGroup>();
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var groups = await dbContext.Notifications
            .AsNoTracking()
            .Where(x => x.Group != null)
            .Select(x => x.Group!)
            .Distinct()
            .OrderBy(x => x)
            .ToListAsync(cancellationToken);

        await Send.ResponseAsync(new NotificationGetGroupsResponse { Groups = groups }, cancellation: cancellationToken);
    }
}

/// <summary>
/// Response payload containing the list of distinct notification group names.
/// </summary>
public sealed class NotificationGetGroupsResponse
{
    public List<string> Groups { get; set; } = [];
}