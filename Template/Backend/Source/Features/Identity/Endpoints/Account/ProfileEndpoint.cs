using Backend.Base.Dto;
using Backend.Data;
using Backend.Features.Identity.Core;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Identity.Endpoints.Account;

sealed class ProfileEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService)
    : EndpointWithoutRequest<UserProfileResponse>
{
    public override void Configure()
    {
        Get("profile");
        Group<AccountGroup>();
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetCurrentUserId();
        var user = await dbContext.Users
                .Where(x => x.Id == userId)
                .Select(x => new UserProfileResponse
                {
                    Id = x.Id,
                    Username = x.Username,
                    Email = x.Email,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Image = x.Image != null ? new ImageDto
                    {
                        ImageBase64 = Convert.ToBase64String(x.Image.Data),
                        ContentType = x.Image.ContentType,
                        FileName = x.Image.FileName
                    } : null,
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
    public ImageDto? Image { get; set; }
}


