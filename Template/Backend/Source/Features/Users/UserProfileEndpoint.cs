using Backend.Data;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Users;

sealed class UserProfileEndpoint : EndpointWithoutRequest<UserProfileResponse>
{
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public UserProfileEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public override void Configure()
    {
        Get("profile");
        Group<UsersGroup>();
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetCurrentUserId();
        var user = await _dbContext.Users
                .Where(x => x.Id == userId)
                .Select(x => new UserProfileResponse
                {
                    Id = x.Id,
                    Username = x.Username,
                    Email = x.Email,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                })
                .FirstOrDefaultAsync(cancellationToken);
        if (user is null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }
        await SendAsync(user, cancellation: cancellationToken);
    }
}

sealed class UserProfileResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}


