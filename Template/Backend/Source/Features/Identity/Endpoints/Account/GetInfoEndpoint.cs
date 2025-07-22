using Backend.Data;
using Backend.Features.Base.Dto;
using Backend.Features.Identity.Core;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Identity.Endpoints.Account;

sealed class GetInfoEndpoint : EndpointWithoutRequest<UserGetInfoResponse>
{
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetInfoEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public override void Configure()
    {
        Get("get-info");
        Group<AccountGroup>();
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetCurrentUserId();
        var user = await _dbContext.Users
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .ThenInclude(x => x.RolePermissions)
            .ThenInclude(x => x.Permission)
            .Where(x => x.Id == userId)
            .Select(x => new UserGetInfoResponse
            {
                Id = x.Id,
                Username = x.Username,
                Email = x.Email,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Image = x.Image != null ? new ImageDto
                {
                    ImageBase64 = Convert.ToBase64String(x.Image.Data),
                    FileName = x.Image.FileName,
                    ContentType = x.Image.ContentType
                } : null,
                Roles = x.UserRoles.Select(x => new UserGetInfoResponse.RoleDto
                {
                    Id = x.RoleId,
                    Name = x.Role.Name,
                    Permissions = x.Role.RolePermissions.Select(x => new UserGetInfoResponse.PermissionDto
                    {
                        Id = x.PermissionId,
                        Name = x.Permission.Name,
                        DisplayName = x.Permission.DisplayName
                    }).ToList()
                }).ToList()
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

sealed class UserGetInfoResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public ImageDto? Image { get; set; }

    public List<RoleDto> Roles { get; set; } = [];


    public class RoleDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public List<PermissionDto> Permissions { get; set; } = [];
    }

    public class PermissionDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string DisplayName { get; set; } = null!;
    }
}


