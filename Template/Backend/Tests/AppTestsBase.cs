using System.Net.Http.Headers;
using Backend.Features.Identity.Endpoints.Account;
using FastEndpoints.Security;

namespace Tests;

[Collection("SharedContext")]
public abstract class AppTestsBase(App app) : TestBase<App>
{
    protected readonly App App = app;

    protected async Task SetAuthToken(string username = "admin", string password = "Admin#123")
    {
        var token = await GetNewAuthToken(username, password);
        App.Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    protected void ClearAuthToken()
    {
        App.Client.DefaultRequestHeaders.Authorization = null;
    }

    private async Task<string> GetNewAuthToken(string username = "admin", string password = "Admin#123")
    {
        var (_, res) = await App.Client.POSTAsync<TokenEndpoint, TokenReq, TokenResponse>(
            new()
            {
                Username = username,
                Password = password
            });

        return res.AccessToken;
    }
}
