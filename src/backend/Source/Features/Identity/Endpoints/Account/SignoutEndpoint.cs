namespace Backend.Features.Identity.Endpoints.Account;

sealed class SignoutEndpoint : EndpointWithoutRequest<EmptyResponse>
{
    public override void Configure()
    {
        Post("signout");
        Group<AccountGroup>();
    }

    public override async Task HandleAsync(CancellationToken c)
    {
        await CookieAuth.SignOutAsync();
        await Send.OkAsync(c);
    }
}
