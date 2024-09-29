using FastEndpointsSample.Entities;

namespace FastEndpointsSample.Features.Users;

sealed class UserCreateEndpoint : Endpoint<UserCreateRequest, UserCreateResponse, UserCreateMapper>
{
    public override void Configure()
    {
        Post("/");
        Group<AdminGroup>();
    }

    public override async Task HandleAsync(UserCreateRequest request, CancellationToken cancellationToken)
    {
        await SendAsync(new UserCreateResponse
        {
            // Add your response properties here
        });
    }
}

sealed class UserCreateRequest
{
    public string Name {get; set;}
	public string Address {get; set;}

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
    public int Id {get; set;}
	public string Name {get; set;}
	public string Address {get; set;}

}

sealed class UserCreateMapper : Mapper<UserCreateRequest, UserCreateResponse, User>
{
    // Define mapping here
}

