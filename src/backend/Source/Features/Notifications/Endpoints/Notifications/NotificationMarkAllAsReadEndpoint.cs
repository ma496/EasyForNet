namespace Backend.Features.Notifications.Endpoints.Notifications;

using Backend.Features.Identity.Core;
using Backend.Features.Notifications.Core.Entities;

/// <summary>
/// POST endpoint that marks all unread notifications as read for the current user.
/// </summary>
sealed class NotificationMarkAllAsReadEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService) : EndpointWithoutRequest<NotificationMarkAllAsReadResponse>
{
    public override void Configure()
    {
        Post("mark-all-as-read");
        Group<NotificationsGroup>();
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetCurrentUserId();
        if (userId == null)
        {
            await Send.UnauthorizedAsync(cancellationToken);
            return;
        }

        var userSpecificUnread = await dbContext.Notifications
            .Where(x => x.UserId == userId.Value && !x.IsRead)
            .ToListAsync(cancellationToken);
        foreach (var n in userSpecificUnread)
            n.IsRead = true;

        var globalUnread = await dbContext.Notifications
            .Where(x => x.UserId == null)
            .Where(x => !dbContext.NotificationVisits
                .Any(v => v.NotificationId == x.Id && v.UserId == userId.Value))
            .ToListAsync(cancellationToken);

        foreach (var n in globalUnread)
        {
            dbContext.NotificationVisits.Add(new NotificationVisit
            {
                NotificationId = n.Id,
                UserId = userId.Value,
                VisitedAt = DateTime.UtcNow
            });
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        await Send.ResponseAsync(new NotificationMarkAllAsReadResponse { Success = true, Message = "All notifications marked as read" }, cancellation: cancellationToken);
    }
}

/// <summary>
/// Response payload confirming that all notifications were marked as read.
/// </summary>
public sealed class NotificationMarkAllAsReadResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
}