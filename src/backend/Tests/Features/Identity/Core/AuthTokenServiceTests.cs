namespace Backend.Tests.Features.Identity.Core;

using Backend.Features.Identity.Core;

/// <summary>
/// Tests for <see cref="IAuthTokenService"/> and <see cref="IAuthTokenCleanService"/> covering token validation, saving, and expiration cleanup.
/// </summary>
public class AuthTokenServiceTests(App app) : AppTestsBase(app)
{
    /// <summary>
    /// Verifies that <see cref="IAuthTokenService.IsValidRefreshTokenAsync"/> returns true when the refresh token is not expired.
    /// </summary>
    [Fact]
    public async Task IsValidRefreshTokenAsync_ShouldReturnTrue_WhenTokenIsValid()
    {
        var authTokenService = App.Services.GetRequiredService<IAuthTokenService>();
        var token = NewToken(TestUsers.TestUserId, $"{Guid.NewGuid()}_{Faker.GlobalUniqueIndex}", DateTime.UtcNow.AddDays(1), $"{Guid.NewGuid()}_{Faker.GlobalUniqueIndex}", DateTime.UtcNow.AddDays(1));
        var savedToken = await authTokenService.SaveTokenAsync(token);
        var isValid = await authTokenService.IsValidRefreshTokenAsync(new TokenRequest { RefreshToken = savedToken.RefreshToken, UserId = TestUsers.TestUserId.ToString() });

        isValid.Should().BeTrue();
    }

    /// <summary>
    /// Verifies that <see cref="IAuthTokenService.IsValidRefreshTokenAsync"/> returns false when the refresh token has expired.
    /// </summary>
    [Fact]
    public async Task IsValidRefreshTokenAsync_ShouldReturnFalse_WhenTokenIsInvalid()
    {
        var authTokenService = App.Services.GetRequiredService<IAuthTokenService>();
        var token = NewToken(TestUsers.TestUserId, $"{Guid.NewGuid()}_{Faker.GlobalUniqueIndex}", DateTime.UtcNow.AddDays(-1), $"{Guid.NewGuid()}_{Faker.GlobalUniqueIndex}", DateTime.UtcNow.AddDays(-1));
        var savedToken = await authTokenService.SaveTokenAsync(token);
        var isValid = await authTokenService.IsValidRefreshTokenAsync(new TokenRequest { RefreshToken = savedToken.RefreshToken, UserId = TestUsers.TestUserId.ToString() });

        isValid.Should().BeFalse();
    }

    /// <summary>
    /// Verifies that <see cref="IAuthTokenCleanService.DeleteExpiredTokensAsync"/> removes expired tokens from the database.
    /// </summary>
    [Fact]
    public async Task DeleteExpiredTokensAsync_ShouldDeleteExpiredTokens()
    {
        var authTokenService = App.Services.GetRequiredService<IAuthTokenService>();
        var authTokenCleanService = App.Services.GetRequiredService<IAuthTokenCleanService>();
        // create expired token
        var expiredToken = NewToken(TestUsers.TestUserId, $"{Guid.NewGuid()}_{Faker.GlobalUniqueIndex}", DateTime.UtcNow.AddDays(-1), $"{Guid.NewGuid()}_{Faker.GlobalUniqueIndex}", DateTime.UtcNow.AddDays(-1));
        var token = await authTokenService.SaveTokenAsync(expiredToken);
        // delete expired tokens
        await authTokenCleanService.DeleteExpiredTokensAsync();

        // assert
        var deletedToken = await DbContext.AuthTokens
            .Where(t => t.Id == token.Id)
            .FirstOrDefaultAsync(cancellationToken: TestContext.Current.CancellationToken);

        deletedToken.Should().BeNull();
    }

    /// <summary>
    /// Creates a <see cref="TokenResponse"/> with specified expiry dates using reflection to set private properties.
    /// </summary>
    private static TokenResponse NewToken(Guid userId, string accessToken, DateTime accessExpiry, string refreshToken, DateTime refreshExpiry)
    {
        var expiredToken = new TokenResponse
        {
            UserId = userId.ToString(),
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
        // set expiry to 1 day ago, use reflection to access private property
        var accessExpiryProperty = expiredToken.GetType().GetProperty("AccessExpiry");
        accessExpiryProperty?.SetValue(expiredToken, accessExpiry);
        var refreshExpiryProperty = expiredToken.GetType().GetProperty("RefreshExpiry");
        refreshExpiryProperty?.SetValue(expiredToken, refreshExpiry);
        return expiredToken;
    }
}
