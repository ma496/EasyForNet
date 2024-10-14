using FastEndpointsSample.Entities;
using FastEndpointsSample.Features;

namespace FastEndpointsSample.Features.Users;

sealed class UserCreateEndpoint : Endpoint<UserCreateRequest, UserCreateResponse, UserCreateMapper>
{
    public override void Configure()
    {
        Post("/");
        Group<AdminGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(UserCreateRequest request, CancellationToken cancellationToken)
    {
        var entity = Map.ToEntity(request);
        // save entity to db
        await SendAsync(Map.FromEntity(entity));
    }
}

sealed class UserCreateRequest
{
    public string Name { get; set;}
	public string Email { get; set;}
	public string Address { get; set;}
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
    public int Id { get; set;}
	public string Name { get; set;}
	public string Email { get; set;}
	public string Address { get; set;}
}

sealed class UserCreateMapper : Mapper<UserCreateRequest, UserCreateResponse, User>
{
    public override User ToEntity(UserCreateRequest r)
    {
        return new User
        {
            Name = r.Name,
			Email = r.Email,
			Address = r.Address,
        };
    }

    public override UserCreateResponse FromEntity(User e)
    {
        return new UserCreateResponse
        {
            Id = e.Id,
			Name = e.Name,
			Email = e.Email,
			Address = e.Address,
        };
    }
}

