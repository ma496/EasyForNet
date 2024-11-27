using System.Net.Http.Headers;
using Backend.Features;
using FastEndpoints.Security;

namespace Tests;

[Collection("SharedContext")]
public abstract class MyTestsBase(App app) : TestBase<App>
{
    protected readonly App App = app;
    protected string? AdminToken;

    protected async Task<string> GetAdminToken()
    {
        if (AdminToken != null) return AdminToken;

        var (_, res) = await App.Client.POSTAsync<LoginEndpoint, LoginRequest, TokenResponse>(
            new()
            {
                Username = "admin",
                Password = "Admin#123"
            });

        AdminToken = res.AccessToken;
        return AdminToken;
    }

    protected async Task SetAuthToken()
    {
        var token = await GetAdminToken();
        App.Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }
}
