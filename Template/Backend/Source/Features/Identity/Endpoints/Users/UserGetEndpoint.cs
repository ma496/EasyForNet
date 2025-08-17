using Backend.Base.Dto;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Riok.Mapperly.Abstractions;
using Backend.Permissions;

namespace Backend.Features.Identity.Endpoints.Users;

sealed class UserGetEndpoint(IUserService userService) : Endpoint<UserGetRequest, UserGetResponse>
{
    public override void Configure()
    {
        Get("{id}");
        Group<UsersGroup>();
        Permissions(Allow.User_View);
    }

    public override async Task HandleAsync(UserGetRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await userService.Users()
            .AsNoTracking()
            .Include(x => x.UserRoles)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity == null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }

        await SendAsync(new UserGetResponseMapper().Map(entity), cancellation: cancellationToken);
    }
}

sealed class UserGetRequest : BaseDto<Guid>
{
}

sealed class UserGetValidator : Validator<UserGetRequest>
{
}

public sealed class UserGetResponse : AuditableDto<Guid>
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

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class UserGetResponseMapper
{
    [MapProperty("UserRoles", "Roles", Use = nameof(UserRolesToRoles))]
    public partial UserGetResponse Map(User entity);

    private static List<Guid> UserRolesToRoles(ICollection<UserRole> userRoles)
        => userRoles.Select(x => x.RoleId).ToList();
}