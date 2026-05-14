namespace Backend.Tests.Features.Identity.Core;

using Backend.Features.Identity.Core;

public class AuthTokenServiceTests(App app) : AppTestsBase(app)
{
    [Fact]
    public async Task IsValidRefreshTokenAsync_ShouldReturnTrue_WhenTokenIsValid()
    {
        var authTokenService = App.Services.GetRequiredService<IAuthTokenService>();
        var dbContext = App.Services.GetRequiredService<AppDbContext>();
        var token = NewToken(TestUsers.TestUserId, $"{Guid.NewGuid()}_{Faker.GlobalUniqueIndex}", DateTime.UtcNow.AddDays(1), $"{Guid.NewGuid()}_{Faker.GlobalUniqueIndex}", DateTime.UtcNow.AddDays(1));
        var savedToken = await authTokenService.SaveTokenAsync(token);
        var isValid = await authTokenService.IsValidRefreshTokenAsync(new TokenRequest { RefreshToken = savedToken.RefreshToken, UserId = TestUsers.TestUserId.ToString() });

        isValid.Should().BeTrue();
    }

    [Fact]
    public async Task IsValidRefreshTokenAsync_ShouldReturnFalse_WhenTokenIsInvalid()
    {
        var authTokenService = App.Services.GetRequiredService<IAuthTokenService>();
        var dbContext = App.Services.GetRequiredService<AppDbContext>();
        var token = NewToken(TestUsers.TestUserId, $"{Guid.NewGuid()}_{Faker.GlobalUniqueIndex}", DateTime.UtcNow.AddDays(-1), $"{Guid.NewGuid()}_{Faker.GlobalUniqueIndex}", DateTime.UtcNow.AddDays(-1));
        var savedToken = await authTokenService.SaveTokenAsync(token);
        var isValid = await authTokenService.IsValidRefreshTokenAsync(new TokenRequest { RefreshToken = savedToken.RefreshToken, UserId = TestUsers.TestUserId.ToString() });

        isValid.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteExpiredTokensAsync_ShouldDeleteExpiredTokens()
    {
        var authTokenService = App.Services.GetRequiredService<IAuthTokenService>();
        var authTokenCleanService = App.Services.GetRequiredService<IAuthTokenCleanService>();
        var dbContext = App.Services.GetRequiredService<AppDbContext>();
        // create expired token
        var expiredToken = NewToken(TestUsers.TestUserId, $"{Guid.NewGuid()}_{Faker.GlobalUniqueIndex}", DateTime.UtcNow.AddDays(-1), $"{Guid.NewGuid()}_{Faker.GlobalUniqueIndex}", DateTime.UtcNow.AddDays(-1));
        var token = await authTokenService.SaveTokenAsync(expiredToken);
        // delete expired tokens
        await authTokenCleanService.DeleteExpiredTokensAsync();

        // assert
        var deletedToken = await dbContext.AuthTokens
            .Where(t => t.Id == token.Id)
            .FirstOrDefaultAsync(cancellationToken: TestContext.Current.CancellationToken);

        deletedToken.Should().BeNull();
    }

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
