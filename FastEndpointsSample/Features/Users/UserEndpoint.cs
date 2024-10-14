using FastEndpointsSample.Entities;
using FastEndpointsSample.Features;

namespace FastEndpointsSample.Features.Users;

sealed class UserEndpoint : Endpoint<UserRequest, UserResponse, UserMapper>
{
    public override void Configure()
    {
        Get("/{id}/");
        Group<AdminGroup>();
    }

    public override async Task HandleAsync(UserRequest request, CancellationToken cancellationToken)
    {
        var entity = new User(); // get entity from db
        await SendAsync(Map.FromEntity(entity));
    }
}

sealed class UserRequest
{
    public Int32 Id { get; set; }
}

sealed class UserValidator : Validator<UserRequest>
{
    public UserValidator()
    {
        // Add validation rules here
    }
}

sealed class UserResponse
{
    public int Id { get; set;}
	public string Name { get; set;}
	public string Email { get; set;}
	public string Address { get; set;}
}

sealed class UserMapper : Mapper<UserRequest, UserResponse, User>
{
    public override UserResponse FromEntity(User e)
    {
        return new UserResponse
        {
            Id = e.Id,
			Name = e.Name,
			Email = e.Email,
			Address = e.Address,
        };
    }
}

