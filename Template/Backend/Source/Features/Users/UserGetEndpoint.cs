using FastEndpoints;
using FluentValidation;
using Backend.Data.Entities;
using Backend.Data;

namespace Backend.Features.Users;

sealed class UserGetEndpoint : Endpoint<UserGetRequest, UserGetResponse, UserGetMapper>
{
    private readonly AppDbContext _dbContext;

    public UserGetEndpoint(AppDbContext context)
    {
        _dbContext = context;
    }

    public override void Configure()
    {
        Get("{id}");
        Group<UsersGroup>();
        // AllowAnonymous();
        Roles("Admin");
    }

    public override async Task HandleAsync(UserGetRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _dbContext.Users.FindAsync(request.Id, cancellationToken);; 
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
    public string Id { get; set; }
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
    public string Id { get; set; }
	public string? UserName { get; set; }
	public string? Email { get; set; }
	public string? PhoneNumber { get; set; }
	public bool TwoFactorEnabled { get; set; }
	public bool LockoutEnabled { get; set; }
}

sealed class UserGetMapper : Mapper<UserGetRequest, UserGetResponse, AppUser>
{
    public override UserGetResponse FromEntity(AppUser e)
    {
        return new UserGetResponse
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


