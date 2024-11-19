using Backend.Auth;
using Backend.Data;
using Backend.Data.Entities.Identity;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Users;

sealed class UserUpdateEndpoint : Endpoint<UserUpdateRequest, UserUpdateResponse, UserUpdateMapper>
{
    private readonly IUserService _userService;
    private readonly AppDbContext _dbContext;

    public UserUpdateEndpoint(IUserService userService, AppDbContext dbContext)
    {
        _userService = userService;
        _dbContext = dbContext;
    }

    public override void Configure()
    {
        Put("{id}");
        Group<UsersGroup>();
        Permissions(Allow.Users_Update);
    }

    public override async Task HandleAsync(UserUpdateRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _userService.Users()
            .Include(x => x.UserRoles)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity == null)
        {
            await SendNotFoundAsync();
            return;
        }

        Map.UpdateEntity(request, entity);
        // update user roles based on request and already assigned roles
        var rolesToAssign = request.Roles.Where(x => !entity.UserRoles.Any(ur => ur.RoleId == x)).ToList();
        foreach (var role in rolesToAssign)
        {
            entity.UserRoles.Add(new UserRole { RoleId = role });
        }
        var rolesToRemove = entity.UserRoles.Where(x => !request.Roles.Contains(x.RoleId)).ToList();
        foreach (var role in rolesToRemove)
        {
            entity.UserRoles.Remove(role);
        }

        // save entity to db
        await _userService.UpdateAsync(entity);
        await SendAsync(Map.FromEntity(entity));
    }
}

sealed class UserUpdateRequest
{
    public Guid Id { get; set; }
	public string Username { get; set; }
	public string Email { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public bool IsActive { get; set; }
	public List<Guid> Roles { get; set; } = new();
}

sealed class UserUpdateValidator : Validator<UserUpdateRequest>
{
    public UserUpdateValidator()
    {
        // Add validation rules here
    }
}

sealed class UserUpdateResponse
{
    public Guid Id { get; set; }
	public string Username { get; set; }
	public string Email { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public bool IsActive { get; set; }
	public List<Guid> Roles { get; set; } = new();
}

sealed class UserUpdateMapper : Mapper<UserUpdateRequest, UserUpdateResponse, User>
{
    public override User UpdateEntity(UserUpdateRequest r, User e)
    {
        e.Username = r.Username;
		e.Email = r.Email;
		e.FirstName = r.FirstName;
		e.LastName = r.LastName;
		e.IsActive = r.IsActive;

        return e;
    }

    public override UserUpdateResponse FromEntity(User e)
    {
        return new UserUpdateResponse
        {
            Id = e.Id,
			Username = e.Username,
			Email = e.Email,
			FirstName = e.FirstName,
			LastName = e.LastName,
			IsActive = e.IsActive,
            Roles = e.UserRoles.Select(x => x.RoleId).ToList(),
        };
    }
}


