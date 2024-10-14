using FastEndpointsSample.Entities;
using FastEndpointsSample.Features;

namespace FastEndpointsSample.Features.Users;

sealed class UserDeleteEndpoint : Endpoint<UserDeleteRequest, UserDeleteResponse>
{
    public override void Configure()
    {
        Delete("/{id}/");
        Group<AdminGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(UserDeleteRequest request, CancellationToken cancellationToken)
    {
        var entity = new User(); // get entity from db
        // Delete the entity from the database
        // You might want to add some logic here to check if the entity exists before deleting
        await SendAsync(new UserDeleteResponse { Success = true });
    }
}

sealed class UserDeleteRequest
{
    public int Id { get; set; }
}

sealed class UserDeleteValidator : Validator<UserDeleteRequest>
{
    public UserDeleteValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

sealed class UserDeleteResponse
{
    public bool Success { get; set; }
    public string Message { get; set; }
}

