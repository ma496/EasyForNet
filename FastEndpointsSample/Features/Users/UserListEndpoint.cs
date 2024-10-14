using FastEndpointsSample.Entities;

namespace FastEndpointsSample.Features.Users;

sealed class UserListEndpoint : Endpoint<UserListRequest, List<UserListResponse>, UserListMapper>
{
    public override void Configure()
    {
        Get("/");
        Group<AdminGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(UserListRequest request, CancellationToken cancellationToken)
    {
        var entities = new List<User>(); // get entities from db
        await SendAsync(Map.FromEntity(entities));
    }
}

sealed class UserListRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    // Add any additional filter properties here
}

sealed class UserListValidator : Validator<UserListRequest>
{
    public UserListValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
        // Add additional validation rules here
    }
}

sealed class UserListResponse
{
    public int Id { get; set; }
	public string Name { get; set; }
	public string Email { get; set; }
	public string Address { get; set; }
}

sealed class UserListMapper : Mapper<UserListRequest, List<UserListResponse>, List<User>>
{
    public override List<UserListResponse> FromEntity(List<User> e)
    {
        return e.Select(entity => new UserListResponse
        {
            Id = entity.Id,
			Name = entity.Name,
			Email = entity.Email,
			Address = entity.Address,
        }).ToList();
    }
}

