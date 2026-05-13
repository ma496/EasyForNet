namespace Backend.Features.Notifications.Endpoints.Notifications;

using Backend.Base.Dto;
using Backend.Features.Identity.Core;
using Backend.Features.Notifications.Core;
using Backend.Features.Notifications.Core.Entities;

sealed class NotificationMarkAsUnreadEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService) : Endpoint<NotificationMarkAsUnreadRequest, NotificationMarkAsUnreadResponse>
{
    public override void Configure()
    {
        Post("{id}/mark-as-unread");
        Group<NotificationsGroup>();
    }

    public override async Task HandleAsync(NotificationMarkAsUnreadRequest request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetCurrentUserId();
        if (userId == null)
        {
            await Send.UnauthorizedAsync(cancellationToken);
            return;
        }

        var notification = await dbContext.Notifications
            .FirstOrDefaultAsync(x => x.Id == request.Id && (x.UserId == userId.Value || x.UserId == null), cancellationToken);

        if (notification == null)
        {
            await Send.NotFoundAsync(cancellationToken);
            return;
        }

        if (notification.UserId == null)
        {
            await dbContext.NotificationVisits
                .Where(v => v.NotificationId == notification.Id && v.UserId == userId.Value)
                .ExecuteDeleteAsync(cancellationToken);
        }
        else
        {
            notification.IsRead = false;
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        await Send.ResponseAsync(new NotificationMarkAsUnreadResponse { Id = request.Id, Success = true, Message = "Notification marked as unread" }, cancellation: cancellationToken);
    }
}

sealed class NotificationMarkAsUnreadRequest : BaseDto<Guid>
{
}

sealed class NotificationMarkAsUnreadValidator : Validator<NotificationMarkAsUnreadRequest>
{
    public NotificationMarkAsUnreadValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

public sealed class NotificationMarkAsUnreadResponse : BaseDto<Guid>
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
}