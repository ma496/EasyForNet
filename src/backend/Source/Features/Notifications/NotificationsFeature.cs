namespace Backend.Features.Notifications;

using Backend.Attributes;
using Backend.Features.Notifications.Core;

[BypassNoDirectUse]
public class NotificationsFeature : IFeature
{
    public static void AddServices(IServiceCollection services, ConfigurationManager configuration)
    {
        services.AddScoped<INotificationService, NotificationService>();
    }
}