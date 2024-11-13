using FastEndpoints;
using FluentValidation;
using Backend.Data.Entities;
using Backend.Data;
using Microsoft.AspNetCore.Identity;
using FluentValidation.Results;

namespace Backend.Features.Users;

sealed class UserCreateEndpoint : Endpoint<UserCreateRequest, UserCreateResponse, UserCreateMapper>
{
    private readonly AppDbContext _dbContext;
	private readonly UserManager<AppUser> _userManager;

    public UserCreateEndpoint(AppDbContext context, UserManager<AppUser> userManager)
    {
        _dbContext = context;
		_userManager = userManager;
    }

    public override void Configure()
    {
        Post("");
        Roles("Admin");
        Group<UsersGroup>();
        // AllowAnonymous();
    }

    public override async Task HandleAsync(UserCreateRequest request, CancellationToken cancellationToken)
    {
        var entity = Map.ToEntity(request);
        // save entity to db
		var result = await _userManager.CreateAsync(entity, request.Password);
		if (!result.Succeeded)
		{
			foreach (var error in result.Errors)
				AddError(error.Description, error.Code);
			ThrowIfAnyErrors();
		}
        await SendAsync(Map.FromEntity(entity));
    }
}

sealed class UserCreateRequest
{
    public string? UserName { get; set; }
	public string? Email { get; set; }
	public string Password { get; set; } = string.Empty;
	public string? PhoneNumber { get; set; }
	public bool TwoFactorEnabled { get; set; }
	public bool LockoutEnabled { get; set; }
}

sealed class UserCreateValidator : Validator<UserCreateRequest>
{
    public UserCreateValidator()
    {
        RuleFor(x => x.UserName).NotEmpty().MinimumLength(3).MaximumLength(20);
		RuleFor(x => x.Email).NotEmpty().EmailAddress();
		RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
    }
}

sealed class UserCreateResponse
{
    public string Id { get; set; }
	public string? UserName { get; set; }
	public string? Email { get; set; }
	public string? PhoneNumber { get; set; }
	public bool TwoFactorEnabled { get; set; }
	public bool LockoutEnabled { get; set; }
}

sealed class UserCreateMapper : Mapper<UserCreateRequest, UserCreateResponse, AppUser>
{
    public override AppUser ToEntity(UserCreateRequest r)
    {
        return new AppUser
        {
            UserName = r.UserName,
			Email = r.Email,
			PhoneNumber = r.PhoneNumber,
			TwoFactorEnabled = r.TwoFactorEnabled,
			LockoutEnabled = r.LockoutEnabled,
        };
    }

    public override UserCreateResponse FromEntity(AppUser e)
    {
        return new UserCreateResponse
        {
            Id = e.Id,
			UserName = e.UserName,
			Email = e.Email,
			PhoneNumber = e.PhoneNumber,
			TwoFactorEnabled = e.TwoFactorEnabled,
			LockoutEnabled = e.LockoutEnabled,
        };
    }
}


