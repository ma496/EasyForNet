using Backend.Auth;
using Backend.Data.Entities.Identity;
using Backend.Services.Identity;
using FluentValidation;

namespace Backend.Features.Users;

sealed class UserCreateEndpoint : Endpoint<UserCreateRequest, UserCreateResponse, UserCreateMapper>
{
    private readonly IUserService _userService;

    public UserCreateEndpoint(IUserService userService)
    {
        _userService = userService;
    }

    public override void Configure()
    {
        Post("");
        Group<UsersGroup>();
        Permissions(Allow.Users_Create);
    }

    public override async Task HandleAsync(UserCreateRequest request, CancellationToken cancellationToken)
    {
        var entity = Map.ToEntity(request);
        // save entity to db
        await _userService.CreateAsync(entity, request.Password);
        await SendAsync(Map.FromEntity(entity));
    }
}

sealed class UserCreateRequest
{
    public string Username { get; set; }
	public string Email { get; set; }
    public string Password { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public bool IsActive { get; set; }
    public List<Guid> Roles { get; set; } = new();
}

sealed class UserCreateValidator : Validator<UserCreateRequest>
{
    public UserCreateValidator()
    {
        RuleFor(x => x.Username).NotEmpty().MinimumLength(3);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
    }
}

sealed class UserCreateResponse
{
    public Guid Id { get; set; }
	public string Username { get; set; }
	public string Email { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public bool IsActive { get; set; }
    public List<Guid> Roles { get; set; } = new();
}

sealed class UserCreateMapper : Mapper<UserCreateRequest, UserCreateResponse, User>
{
    public override User ToEntity(UserCreateRequest r)
    {
        return new User
        {
            Username = r.Username,
			Email = r.Email,
			FirstName = r.FirstName,
			LastName = r.LastName,
			IsActive = r.IsActive,
            UserRoles = r.Roles.Select(x => new UserRole { RoleId = x }).ToList(),
        };
    }

    public override UserCreateResponse FromEntity(User e)
    {
        return new UserCreateResponse
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

    
