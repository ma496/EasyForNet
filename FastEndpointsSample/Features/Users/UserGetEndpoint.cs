using FastEndpointsSample.Entities;
using FastEndpointsSample.Features;

namespace FastEndpointsSample.Features.Users;

sealed class UserGetEndpoint : Endpoint<UserGetRequest, UserGetResponse, UserGetMapper>
{
    public override void Configure()
    {
        Get("/{id}/");
        Group<AdminGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(UserGetRequest request, CancellationToken cancellationToken)
    {
        var entity = new User(); // get entity from db
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
	public string Name { get; set; }
	public string Email { get; set; }
	public string Address { get; set; }
}

sealed class UserGetMapper : Mapper<UserGetRequest, UserGetResponse, User>
{
    public override UserGetResponse FromEntity(User e)
    {
        return new UserGetResponse
        {
            Id = e.Id,
			Name = e.Name,
			Email = e.Email,
			Address = e.Address,
        };
    }
}

