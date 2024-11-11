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
        AllowAnonymous();
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
    public int Id { get; set; }
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
    public int Id { get; set; }
	public string Username { get; set; }
	public string Password { get; set; }
	public string Email { get; set; }
	public string Name { get; set; }
}

sealed class UserGetMapper : Mapper<UserGetRequest, UserGetResponse, User>
{
    public override UserGetResponse FromEntity(User e)
    {
        return new UserGetResponse
        {
            Id = e.Id,
			Username = e.Username,
			Password = e.Password,
			Email = e.Email,
			Name = e.Name,
        };
    }
}


