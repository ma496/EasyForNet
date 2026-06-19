namespace Backend.Features.Notifications.Endpoints.Notifications;

using Backend.Base.Dto;
using Backend.Features.Identity.Core;
using Backend.Features.Notifications.Core;
using Backend.Features.Notifications.Core.Entities;

/// <summary>
/// GET endpoint that returns a paged, filterable list of notifications visible to the current user,
/// resolving per-user read state for global notifications.
/// </summary>
sealed class NotificationListEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService) : Endpoint<NotificationListRequest, NotificationListResponse>
{
    public override void Configure()
    {
        Get("");
        Group<NotificationsGroup>();
    }

    public override async Task HandleAsync(NotificationListRequest request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetCurrentUserId();
        if (userId == null)
        {
            return;
        }

        // Fetch all visited notification IDs for the user first (needed for IsRead filtering)
        var visitedNotificationIds = await dbContext.NotificationVisits
            .AsNoTracking()
            .Where(v => v.UserId == userId.Value)
            .Select(v => v.NotificationId)
            .ToListAsync(cancellationToken);

        var query = dbContext.Notifications
            .AsNoTracking()
            .Where(x => x.UserId == userId.Value || x.UserId == null);

        if (request.IsRead == true)
        {
            query = query.Where(x => x.UserId == null
                ? visitedNotificationIds.Contains(x.Id)
                : x.IsRead);
        }
        else if (request.IsRead == false)
        {
            query = query.Where(x => x.UserId == null
                ? !visitedNotificationIds.Contains(x.Id)
                : !x.IsRead);
        }

        if (!string.IsNullOrWhiteSpace(request.Group))
        {
            query = query.Where(x => x.Group == request.Group);
        }

        var search = request.Search?.Trim();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                EF.Functions.ILike(x.TitleKey, $"%{search}%") ||
                EF.Functions.ILike(x.MessageKey, $"%{search}%") ||
                x.Type.ToString().ToLower().Contains(search.ToLower()));
        }

        var total = await query.CountAsync(cancellationToken);

        query = query
            .OrderBy(x => x.IsRead)
            .Process(request, applyDefaultOrdering: false);

        var notifications = await NotificationListDtoMapper.ProjectTo(query)
            .ToListAsync(cancellationToken);

        // Rebuild visitedNotificationIds for only the returned notifications
        var notificationIds = notifications.Select(n => n.Id).ToList();
        var pageVisitedIds = await dbContext.NotificationVisits
            .AsNoTracking()
            .Where(v => v.UserId == userId.Value && notificationIds.Contains(v.NotificationId))
            .Select(v => v.NotificationId)
            .ToListAsync(cancellationToken);

        notifications.ForEach(n =>
        {
            n.IsRead = n.UserId == null
                ? pageVisitedIds.Contains(n.Id)
                : n.IsRead;
        });

        await Send.ResponseAsync(new NotificationListResponse
        {
            Items = notifications,
            Total = total
        }, cancellation: cancellationToken);
    }
}

/// <summary>
/// Request payload for listing notifications, supporting pagination, read-state filtering,
/// group filtering, and free-text search.
/// </summary>
sealed class NotificationListRequest : ListRequestDto<Guid>
{
    public bool? IsRead { get; set; }
    public string? Group { get; set; }
}

/// <summary>
/// Validator for <see cref="NotificationListRequest"/> that applies the standard list request rules.
/// </summary>
sealed class NotificationListValidator : Validator<NotificationListRequest>
{
    public NotificationListValidator()
    {
        Include(new ListRequestDtoValidator<Guid>());
    }
}

/// <summary>
/// Paged response containing notification list items and the total count.
/// </summary>
public sealed class NotificationListResponse : ListDto<NotificationListDto>
{
}

/// <summary>
/// DTO representing a single notification in list responses.
/// </summary>
public sealed class NotificationListDto : AuditableDto<Guid>
{
    public NotificationType Type { get; set; }
    public string TitleKey { get; set; } = null!;
    public string MessageKey { get; set; } = null!;
    public bool IsRead { get; set; }
    public string? Group { get; set; }
    public string? Metadata { get; set; }

    public Guid? UserId { get; set; }
}

/// <summary>
/// Mapper that projects a <see cref="Notification"/> query into <see cref="NotificationListDto"/> DTOs.
/// </summary>
[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public static partial class NotificationListDtoMapper
{
    public static partial IQueryable<NotificationListDto> ProjectTo(IQueryable<Notification> query);

    private static partial NotificationListDto Map(Notification entity);
}
