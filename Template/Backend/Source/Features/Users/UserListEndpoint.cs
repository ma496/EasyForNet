using Backend.Data.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Backend.Services.Identity;
using Backend.Auth;
using Backend.Features.Base.Dto;
using Backend.Extensions;

namespace Backend.Features.Users;

sealed class UserListEndpoint : Endpoint<UserListRequest, UserListResponse, UserListMapper>
{
    private readonly IUserService _userService;

    public UserListEndpoint(IUserService userService)
    {
        _userService = userService;
    }

    public override void Configure()
    {
        Get("");
        Group<UsersGroup>();
        Permissions(Allow.User_View);
    }

    public override async Task HandleAsync(UserListRequest request, CancellationToken cancellationToken)
    {
        // get entities from db
        var query = _userService.Users()
            .AsNoTracking()
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .AsQueryable();

        var search = request.Search?.Trim()?.ToLower();
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

        var response = new UserListResponse
        {
            Items = Map.FromEntity(items),
            Total = total
        };

        await SendAsync(response, cancellation: cancellationToken);
    }
}

sealed class UserListRequest : ListRequestDto
{
}

sealed class UserListValidator : Validator<UserListRequest>
{
    public UserListValidator()
    {
        Include(new ListRequestDtoValidator());
    }
}

sealed class UserListResponse : ListDto<UserListDto>
{
}

sealed class UserListDto : AuditableDto<Guid>
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsActive { get; set; }
    public List<UserRoleDto> Roles { get; set; } = [];
}

sealed class UserRoleDto : BaseDto<Guid>
{
    public string Name { get; set; } = null!;
}

sealed class UserListMapper : Mapper<UserListRequest, List<UserListDto>, List<User>>
{
    public override List<UserListDto> FromEntity(List<User> e)
    {
        return e.Select(entity => new UserListDto
        {
            Id = entity.Id,
            Username = entity.Username,
            Email = entity.Email,
            FirstName = entity.FirstName,
            LastName = entity.LastName,
            IsActive = entity.IsActive,
            CreatedAt = entity.CreatedAt,
            CreatedBy = entity.CreatedBy,
            UpdatedAt = entity.UpdatedAt,
            UpdatedBy = entity.UpdatedBy,
            Roles = entity.UserRoles != null
             ? entity.UserRoles.Select(x => new UserRoleDto
             {
                 Id = x.RoleId,
                 Name = x.Role.Name
             }).ToList() : [],
        }).ToList();
    }
}


