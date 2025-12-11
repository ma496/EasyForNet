namespace Backend.Tests;

using Backend.Features.Identity.Endpoints.Account;
using System.Net.Http.Headers;

public static class TestsHelper
{
    public static async Task<string> GetNewAuthTokenAsync(HttpClient client, string username = "admin", string password = "Admin#123")
    {
        var (_, res) = await client.POSTAsync<TokenEndpoint, TokenReq, TokenResponse>(
            new()
            {
                Username = username,
                Password = password
            });

        return res.AccessToken;
    }

    public static async Task SetNewAuthTokenAsync(HttpClient client, string username = "admin", string password = "Admin#123")
    {
        var token = await GetNewAuthTokenAsync(client, username, password);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }
}
