using FastEndpointsSample.Data.Entities;
using FastEndpointsSample.Data;

namespace FastEndpointsSample.Features.Users;

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
    public int Id { get; set; }
	public string Username { get; set; }
	public string Password { get; set; }
	public string Email { get; set; }
	public string Name { get; set; }
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
    public int Id { get; set; }
	public string Username { get; set; }
	public string Password { get; set; }
	public string Email { get; set; }
	public string Name { get; set; }
}

sealed class UserUpdateMapper : Mapper<UserUpdateRequest, UserUpdateResponse, User>
{
    public override User UpdateEntity(UserUpdateRequest r, User e)
    {
        e.Username = r.Username;
		e.Password = r.Password;
		e.Email = r.Email;
		e.Name = r.Name;

        return e;
    }

    public override UserUpdateResponse FromEntity(User e)
    {
        return new UserUpdateResponse
        {
            Id = e.Id,
			Username = e.Username,
			Password = e.Password,
			Email = e.Email,
			Name = e.Name,
        };
    }
}

