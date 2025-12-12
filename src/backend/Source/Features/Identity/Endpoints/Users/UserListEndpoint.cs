namespace Backend.Features.Identity.Endpoints.Users;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;

sealed class UserListEndpoint(IUserService userService) : Endpoint<UserListRequest, UserListResponse>
{
    public override void Configure()
    {
        Get("");
        Group<UsersGroup>();
        Permissions(Allow.User_View);
    }

    public override async Task HandleAsync(UserListRequest request, CancellationToken cancellationToken)
    {
        // get entities from db
        var query = userService.Users()
            .AsNoTracking()
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .AsQueryable();

        var search = request.Search?.Trim().ToLower();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                x.Username.ToLower().Contains(search)
                || x.Email.ToLower().Contains(search)
                || (x.FirstName != null && x.FirstName.ToLower().Contains(search))
                || (x.LastName != null && x.LastName.ToLower().Contains(search)));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .Process(request)
            .ToListAsync(cancellationToken);

        var dtoMapper = new UserListDtoMapper();
        var response = new UserListResponse
        {
            Items = items.Select(dtoMapper.Map).ToList(),
            Total = total
        };

        await Send.ResponseAsync(response, cancellation: cancellationToken);
    }
}

sealed class UserListRequest : ListRequestDto<Guid>
{
}

sealed class UserListValidator : Validator<UserListRequest>
{
    public UserListValidator()
    {
        Include(new ListRequestDtoValidator<Guid>());
    }
}

public sealed class UserListResponse : ListDto<UserListDto>
{
}

public sealed class UserListDto : AuditableDto<Guid>
{
    public string Username { get; set; } = null!;
    public string UsernameNormalized { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string EmailNormalized { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsActive { get; set; }
    public List<UserRoleDto> Roles { get; set; } = [];
}

public sealed class UserRoleDto : BaseDto<Guid>
{
    public string Name { get; set; } = null!;
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class UserListDtoMapper
{
    [MapProperty("UserRoles", "Roles", Use = nameof(UserRolesToRoles))]
    public partial UserListDto Map(User entity);

    private static List<UserRoleDto> UserRolesToRoles(ICollection<UserRole> userRoles)
        => userRoles.Select(x => new UserRoleDto { Id = x.RoleId, Name = x.Role.Name }).ToList();
}