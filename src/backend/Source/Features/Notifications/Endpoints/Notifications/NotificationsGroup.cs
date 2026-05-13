namespace Backend.Features.Notifications.Endpoints.Notifications;

public sealed class NotificationsGroup : Group
{
    public NotificationsGroup()
    {
        Configure("notifications", ep => { });
    }
}
