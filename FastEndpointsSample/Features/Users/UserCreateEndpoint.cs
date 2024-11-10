using FastEndpointsSample.Data.Entities;
using FastEndpointsSample.Data;

namespace FastEndpointsSample.Features.Users;

sealed class UserCreateEndpoint : Endpoint<UserCreateRequest, UserCreateResponse, UserCreateMapper>
{
    private readonly AppDbContext _dbContext;

    public UserCreateEndpoint(AppDbContext context)
    {
        _dbContext = context;
    }

    public override void Configure()
    {
        Post("");
        Group<UsersGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(UserCreateRequest request, CancellationToken cancellationToken)
    {
        var entity = Map.ToEntity(request);
        // save entity to db
        await _dbContext.Users.AddAsync(entity, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        await SendAsync(Map.FromEntity(entity));
    }
}

sealed class UserCreateRequest
{
    public string Username { get; set; }
	public string Password { get; set; }
	public string Email { get; set; }
	public string Name { get; set; }
}

sealed class UserCreateValidator : Validator<UserCreateRequest>
{
    public UserCreateValidator()
    {
        // Add validation rules here
    }
}

sealed class UserCreateResponse
{
    public int Id { get; set; }
	public string Username { get; set; }
	public string Password { get; set; }
	public string Email { get; set; }
	public string Name { get; set; }
}

sealed class UserCreateMapper : Mapper<UserCreateRequest, UserCreateResponse, User>
{
    public override User ToEntity(UserCreateRequest r)
    {
        return new User
        {
            Username = r.Username,
			Password = r.Password,
			Email = r.Email,
			Name = r.Name,
        };
    }

    public override UserCreateResponse FromEntity(User e)
    {
        return new UserCreateResponse
        {
            Id = e.Id,
			Username = e.Username,
			Password = e.Password,
			Email = e.Email,
			Name = e.Name,
        };
    }
}

