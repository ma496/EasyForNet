namespace Backend.Tests;

using Backend.Features.Identity.Endpoints.Account;
using System.Net.Http.Headers;

/// <summary>
/// Helper utilities for setting up test authentication tokens.
/// </summary>
public static class TestsHelper
{
    /// <summary>
    /// Obtains a new JWT access token by calling the token endpoint.
    /// </summary>
    public static async Task<string> GetNewAuthTokenAsync(HttpClient client, string username = "admin", string password = "Admin#123")
    {
        var (_, res) = await client.POSTAsync<TokenEndpoint, TokenRequest, TokenResponse>(
            new()
            {
                Username = username,
                Password = password
            });

        return res.AccessToken;
    }

    /// <summary>
    /// Obtains a new token and sets it as the default Bearer authorization header on the HTTP client.
    /// </summary>
    public static async Task SetNewAuthTokenAsync(HttpClient client, string username = "admin", string password = "Admin#123")
    {
        var token = await GetNewAuthTokenAsync(client, username, password);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }
}
