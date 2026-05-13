namespace Backend.Features.Notifications.Endpoints.Notifications;

using Backend.Features.Identity.Core;
using Backend.Features.Notifications.Core;
using Backend.Features.Notifications.Core.Entities;

sealed class NotificationGetEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService) : Endpoint<NotificationGetRequest, NotificationGetResponse>
{
    public override void Configure()
    {
        Get("{id}");
        Group<NotificationsGroup>();
    }

    public override async Task HandleAsync(NotificationGetRequest request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetCurrentUserId();
        if (userId == null)
        {
            await Send.UnauthorizedAsync(cancellationToken);
            return;
        }

        var query = dbContext.Notifications
            .AsNoTracking()
            .Where(x => x.Id == request.Id && (x.UserId == userId.Value || x.UserId == null));

        var notification = await NotificationGetResponseMapper.ProjectTo(query)
            .FirstOrDefaultAsync(cancellationToken);

        if (notification == null)
        {
            await Send.NotFoundAsync(cancellationToken);
            return;
        }

        if (notification.UserId == null)
        {
            notification.IsRead = await dbContext.NotificationVisits
                .AnyAsync(v => v.NotificationId == notification.Id && v.UserId == userId.Value, cancellationToken);
        }

        await Send.ResponseAsync(notification, cancellation: cancellationToken);
    }
}

sealed class NotificationGetRequest : BaseDto<Guid>
{
}

public sealed class NotificationGetResponse : AuditableDto<Guid>
{
    public NotificationType Type { get; set; }
    public string TitleKey { get; set; } = null!;
    public string MessageKey { get; set; } = null!;
    public bool IsRead { get; set; }
    public string? Group { get; set; }
    public string? Metadata { get; set; }

    public Guid? UserId { get; set; }
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public static partial class NotificationGetResponseMapper
{
    public static partial IQueryable<NotificationGetResponse> ProjectTo(IQueryable<Notification> query);

    private static partial NotificationGetResponse Map(Notification entity);
}
