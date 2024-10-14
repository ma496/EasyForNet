using FastEndpointsSample.Entities;
using FastEndpointsSample.Features;

namespace FastEndpointsSample.Features.Users;

sealed class UserUpdateEndpoint : Endpoint<UserUpdateRequest, UserUpdateResponse, UserUpdateMapper>
{
    public override void Configure()
    {
        Put("/{id}/");
        Group<AdminGroup>();
    }

    public override async Task HandleAsync(UserUpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = new User(); // get entity from db
        Map.UpdateEntity(request, entity);
        await SendAsync(Map.FromEntity(entity));
    }
}

sealed class UserUpdateRequest
{
    public int Id { get; set;}
	public string Name { get; set;}
	public string Email { get; set;}
	public string Address { get; set;}
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
    public int Id { get; set;}
	public string Name { get; set;}
	public string Email { get; set;}
	public string Address { get; set;}
}

sealed class UserUpdateMapper : Mapper<UserUpdateRequest, UserUpdateResponse, User>
{
    public override User UpdateEntity(UserUpdateRequest r, User e)
    {
        e.Name = r.Name;
		e.Email = r.Email;
		e.Address = r.Address;

        return e;
    }

    public override UserUpdateResponse FromEntity(User e)
    {
        return new UserUpdateResponse
        {
            Id = e.Id,
			Name = e.Name,
			Email = e.Email,
			Address = e.Address,
        };
    }
}

