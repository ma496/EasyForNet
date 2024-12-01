using FluentValidation;
using Backend.Data.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Backend.Services.Identity;
using Backend.Auth;

namespace Backend.Features.Users;

sealed class UserListEndpoint : Endpoint<UserListRequest, List<UserListResponse>, UserListMapper>
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
        Permissions(Allow.Users_View);
    }

    public override async Task HandleAsync(UserListRequest request, CancellationToken cancellationToken)
    {
        // get entities from db
        var entities = await _userService.Users()
            .AsNoTracking()
            .Include(x => x.UserRoles)
            .OrderByDescending(x => x.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);
        await SendAsync(Map.FromEntity(entities));
    }
}

sealed class UserListRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    // Add any additional filter properties here
}

sealed class UserListValidator : Validator<UserListRequest>
{
    public UserListValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
        // Add additional validation rules here
    }
}

sealed class UserListResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public List<Guid> Roles { get; set; } = [];
}

sealed class UserListMapper : Mapper<UserListRequest, List<UserListResponse>, List<User>>
{
    public override List<UserListResponse> FromEntity(List<User> e)
    {
        return e.Select(entity => new UserListResponse
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
            Roles = entity.UserRoles.Select(x => x.RoleId).ToList(),
        }).ToList();
    }
}


