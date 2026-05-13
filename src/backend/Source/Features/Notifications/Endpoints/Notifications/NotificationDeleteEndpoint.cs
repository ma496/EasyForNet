namespace Backend.Features.Notifications.Endpoints.Notifications;

using Backend.Base.Dto;
using Backend.Features.Identity.Core;
using Backend.Features.Notifications.Core;

sealed class NotificationDeleteEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService) : Endpoint<NotificationDeleteRequest, NotificationDeleteResponse>
{
    public override void Configure()
    {
        Delete("{id}");
        Group<NotificationsGroup>();
    }

    public override async Task HandleAsync(NotificationDeleteRequest request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetCurrentUserId();
        if (userId == null)
        {
            throw new UserIdNullException();
        }

        var notification = await dbContext.Notifications
            .FirstOrDefaultAsync(x => x.Id == request.Id && x.UserId == userId, cancellationToken);

        if (notification == null)
        {
            await Send.NotFoundAsync(cancellationToken);
            return;
        }

        dbContext.Notifications.Remove(notification);
        await dbContext.SaveChangesAsync(cancellationToken);

        await Send.ResponseAsync(new NotificationDeleteResponse { Id = request.Id, Success = true, Message = "Notification deleted successfully" }, cancellation: cancellationToken);
    }
}

sealed class NotificationDeleteRequest : BaseDto<Guid>
{
}

sealed class NotificationDeleteValidator : Validator<NotificationDeleteRequest>
{
    public NotificationDeleteValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

public sealed class NotificationDeleteResponse : BaseDto<Guid>
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
}