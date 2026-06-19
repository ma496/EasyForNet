namespace Backend.Features.Identity.Endpoints.Account;

/// <summary>
/// Authenticated POST endpoint that signs the current user out by clearing the auth
/// cookie and the refresh-token cookie.
/// </summary>
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
        HttpContext.Response.Cookies.Delete("refreshToken");
        await Send.OkAsync(c);
    }
}
