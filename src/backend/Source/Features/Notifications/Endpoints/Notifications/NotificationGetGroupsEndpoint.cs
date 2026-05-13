namespace Backend.Features.Notifications.Endpoints.Notifications;

using Microsoft.EntityFrameworkCore;

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

public sealed class NotificationGetGroupsResponse
{
    public List<string> Groups { get; set; } = [];
}