namespace Backend.Features.Identity.Endpoints.Account;

using Backend.Features.Identity.Core;

sealed class GetInfoEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService)
    : EndpointWithoutRequest<UserGetInfoResponse>
{
    public override void Configure()
    {
        Get("get-info");
        Group<AccountGroup>();
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetCurrentUserId();
        var user = await dbContext.Users
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
                Image = x.Image,
                Roles = x.UserRoles.Select(ur => new UserGetInfoResponse.RoleDto
                {
                    Id = ur.RoleId,
                    Name = ur.Role.Name,
                    Permissions = ur.Role.RolePermissions.Select(rp => new UserGetInfoResponse.PermissionDto
                    {
                        Id = rp.PermissionId,
                        Name = rp.Permission.Name,
                        DisplayName = rp.Permission.DisplayName
                    }).ToList()
                }).ToList()
            })
            .FirstOrDefaultAsync(cancellationToken);
        if (user is null)
        {
            await Send.NotFoundAsync(cancellationToken);
            return;
        }
        await Send.ResponseAsync(user, cancellation: cancellationToken);
    }
}

sealed class UserGetInfoResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Image { get; set; }

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


