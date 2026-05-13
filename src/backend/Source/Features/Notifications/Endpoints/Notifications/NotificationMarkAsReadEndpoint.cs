namespace Backend.Features.Notifications.Endpoints.Notifications;

using Backend.Base.Dto;
using Backend.Features.Identity.Core;
using Backend.Features.Notifications.Core;
using Backend.Features.Notifications.Core.Entities;

sealed class NotificationMarkAsReadEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService) : Endpoint<NotificationMarkAsReadRequest, NotificationMarkAsReadResponse>
{
    public override void Configure()
    {
        Post("{id}/mark-as-read");
        Group<NotificationsGroup>();
    }

    public override async Task HandleAsync(NotificationMarkAsReadRequest request, CancellationToken cancellationToken)
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
            var isVisit = await dbContext.NotificationVisits
                .AnyAsync(v => v.NotificationId == notification.Id && v.UserId == userId.Value, cancellationToken);
            if (!isVisit)
            {
                dbContext.NotificationVisits.Add(new NotificationVisit
                {
                    NotificationId = notification.Id,
                    UserId = userId.Value,
                    VisitedAt = DateTime.UtcNow
                });
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }
        else
        {
            notification.IsRead = true;
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        await Send.ResponseAsync(new NotificationMarkAsReadResponse { Id = request.Id, Success = true, Message = "Notification marked as read" }, cancellation: cancellationToken);
    }
}

sealed class NotificationMarkAsReadRequest : BaseDto<Guid>
{
}

sealed class NotificationMarkAsReadValidator : Validator<NotificationMarkAsReadRequest>
{
    public NotificationMarkAsReadValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

public sealed class NotificationMarkAsReadResponse : BaseDto<Guid>
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
}