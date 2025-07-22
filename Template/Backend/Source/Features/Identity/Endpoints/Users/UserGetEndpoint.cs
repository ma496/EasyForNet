using Backend.Auth;
using Backend.Features.Base.Dto;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Allow = Backend.Permissions.Allow;

namespace Backend.Features.Identity.Endpoints.Users;

sealed class UserGetEndpoint : Endpoint<UserGetRequest, UserGetResponse, UserGetMapper>
{
    private readonly IUserService _userService;

    public UserGetEndpoint(IUserService userService)
    {
        _userService = userService;
    }

    public override void Configure()
    {
        Get("{id}");
        Group<UsersGroup>();
        Permissions(Allow.User_View);
    }

    public override async Task HandleAsync(UserGetRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _userService.Users()
            .AsNoTracking()
            .Include(x => x.UserRoles)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity == null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }

        await SendAsync(Map.FromEntity(entity), cancellation: cancellationToken);
    }
}

sealed class UserGetRequest : BaseDto<Guid>
{
}

sealed class UserGetValidator : Validator<UserGetRequest>
{
    public UserGetValidator()
    {
        // Add validation rules here
    }
}

sealed class UserGetResponse : AuditableDto<Guid>
{
    public string Username { get; set; } = null!;
    public string UsernameNormalized { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string EmailNormalized { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsActive { get; set; }

    public List<Guid> Roles { get; set; } = [];
}

sealed class UserGetMapper : Mapper<UserGetRequest, UserGetResponse, User>
{
    public override UserGetResponse FromEntity(User e)
    {
        return new UserGetResponse
        {
            Id = e.Id,
            Username = e.Username,
            UsernameNormalized = e.UsernameNormalized,
            Email = e.Email,
            EmailNormalized = e.EmailNormalized,
            FirstName = e.FirstName,
            LastName = e.LastName,
            IsActive = e.IsActive,
            CreatedAt = e.CreatedAt,
            CreatedBy = e.CreatedBy,
            UpdatedAt = e.UpdatedAt,
            UpdatedBy = e.UpdatedBy,
            Roles = e.UserRoles.Select(x => x.RoleId).ToList(),
        };
    }
}


