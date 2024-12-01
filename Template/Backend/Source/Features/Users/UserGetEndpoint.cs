using Backend.Auth;
using Backend.Data.Entities.Identity;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Users;

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
        Permissions(Allow.Users_View);
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
            await SendNotFoundAsync();
            return;
        }

        await SendAsync(Map.FromEntity(entity));
    }
}

sealed class UserGetRequest
{
    public Guid Id { get; set; }
}

sealed class UserGetValidator : Validator<UserGetRequest>
{
    public UserGetValidator()
    {
        // Add validation rules here
    }
}

sealed class UserGetResponse
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

sealed class UserGetMapper : Mapper<UserGetRequest, UserGetResponse, User>
{
    public override UserGetResponse FromEntity(User e)
    {
        return new UserGetResponse
        {
            Id = e.Id,
			Username = e.Username,
			Email = e.Email,
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


