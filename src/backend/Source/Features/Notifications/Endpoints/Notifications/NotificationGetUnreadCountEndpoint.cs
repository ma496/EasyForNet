namespace Backend.Features.Notifications.Endpoints.Notifications;

using Backend.Features.Identity.Core;
using Backend.Features.Notifications.Core;

/// <summary>
/// GET endpoint that returns the number of unread notifications for the current user.
/// </summary>
sealed class NotificationGetUnreadCountEndpoint(ICurrentUserService currentUserService, INotificationService notificationService) : EndpointWithoutRequest<NotificationGetUnreadCountResponse>
{
    public override void Configure()
    {
        Get("unread-count");
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

        var count = await notificationService.GetUnreadCountAsync(userId.Value, cancellationToken);

        await Send.ResponseAsync(new NotificationGetUnreadCountResponse { Count = count }, cancellation: cancellationToken);
    }
}

/// <summary>
/// Response payload containing the unread notification count for the current user.
/// </summary>
public sealed class NotificationGetUnreadCountResponse
{
    public int Count { get; set; }
}