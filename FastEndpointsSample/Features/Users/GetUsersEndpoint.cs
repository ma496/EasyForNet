using FastEndpointsSample.Entities;

namespace FastEndpointsSample.Features.Users;

sealed class GetUsersEndpoint : Endpoint<GetUsersRequest, GetUsersResponse>
{
    public override void Configure()
    {
        Post("get-users");
    }

    public override async Task HandleAsync(GetUsersRequest request, CancellationToken cancellationToken)
    {
        await SendAsync(new GetUsersResponse
        {
            // Add your response properties here
        });
    }
}

sealed class GetUsersRequest
{
    // Define request properties here
}

sealed class GetUsersValidator : Validator<GetUsersRequest>
{
    public GetUsersValidator()
    {
        // Add validation rules here
    }
}

sealed class GetUsersResponse
{
    // Define response properties here
}

sealed class GetUsersMapper : Mapper<GetUsersRequest, GetUsersResponse, User>
{
    // Define mapping here
}

