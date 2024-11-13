using FastEndpoints;
using FluentValidation;
using Backend.Data.Entities;
using Backend.Data;

namespace Backend.Features.Users;

sealed class UserUpdateEndpoint : Endpoint<UserUpdateRequest, UserUpdateResponse, UserUpdateMapper>
{
    private readonly AppDbContext _dbContext;

    public UserUpdateEndpoint(AppDbContext context)
    {
        _dbContext = context;
    }

    public override void Configure()
    {
        Put("{id}");
        Group<UsersGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(UserUpdateRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _dbContext.Users.FindAsync(request.Id, cancellationToken);; 
        if (entity == null)
        {
            await SendNotFoundAsync();
            return;
        }

        Map.UpdateEntity(request, entity);

        // save entity to db
        await _dbContext.SaveChangesAsync(cancellationToken);
        await SendAsync(Map.FromEntity(entity));
    }
}

sealed class UserUpdateRequest
{
    public string Id { get; set; }
	public string? UserName { get; set; }
	public string? Email { get; set; }
	public string? PhoneNumber { get; set; }
	public bool TwoFactorEnabled { get; set; }
	public bool LockoutEnabled { get; set; }
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
    public string Id { get; set; }
	public string? UserName { get; set; }
	public string? Email { get; set; }
	public string? PhoneNumber { get; set; }
	public bool TwoFactorEnabled { get; set; }
	public bool LockoutEnabled { get; set; }
}

sealed class UserUpdateMapper : Mapper<UserUpdateRequest, UserUpdateResponse, AppUser>
{
    public override AppUser UpdateEntity(UserUpdateRequest r, AppUser e)
    {
        e.UserName = r.UserName;
		e.Email = r.Email;
		e.PhoneNumber = r.PhoneNumber;
		e.TwoFactorEnabled = r.TwoFactorEnabled;
		e.LockoutEnabled = r.LockoutEnabled;

        return e;
    }

    public override UserUpdateResponse FromEntity(AppUser e)
    {
        return new UserUpdateResponse
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


