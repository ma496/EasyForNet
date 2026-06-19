namespace Backend.Features.Notifications.Endpoints.Notifications;

using Backend.Base.Dto;
using Backend.Features.Identity.Core;
using Backend.Features.Notifications.Core.Entities;

/// <summary>
/// POST endpoint that marks a single notification as read for the current user.
/// </summary>
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

/// <summary>
/// Request payload containing the identifier of the notification to mark as read.
/// </summary>
sealed class NotificationMarkAsReadRequest : BaseDto<Guid>
{
}

/// <summary>
/// Validates that the <see cref="NotificationMarkAsReadRequest"/> has a non-empty notification id.
/// </summary>
sealed class NotificationMarkAsReadValidator : Validator<NotificationMarkAsReadRequest>
{
    public NotificationMarkAsReadValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

/// <summary>
/// Response payload confirming that a notification has been marked as read.
/// </summary>
public sealed class NotificationMarkAsReadResponse : BaseDto<Guid>
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
}