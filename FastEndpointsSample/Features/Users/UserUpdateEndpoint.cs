using FastEndpointsSample.Entities;

namespace FastEndpointsSample.Features.Users;

sealed class UserUpdateEndpoint : Endpoint<UserUpdateRequest, UserUpdateResponse, UserUpdateMapper>
{
    public override void Configure()
    {
        Put("/");
        Group<AdminGroup>();
    }

    public override async Task HandleAsync(UserUpdateRequest request, CancellationToken cancellationToken)
    {
        await SendAsync(new UserUpdateResponse
        {
            // Add your response properties here
        });
    }
}

sealed class UserUpdateRequest
{
    public int Id {get; set;}
	public string Name {get; set;}
	public string Address {get; set;}

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
    public int Id {get; set;}
	public string Name {get; set;}
	public string Address {get; set;}

}

sealed class UserUpdateMapper : Mapper<UserUpdateRequest, UserUpdateResponse, User>
{
    // Define mapping here
}

