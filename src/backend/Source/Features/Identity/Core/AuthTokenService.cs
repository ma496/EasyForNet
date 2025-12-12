namespace Backend.Features.Identity.Core;

using Backend.Attributes;
using Backend.Features.Identity.Core.Entities;

public interface IAuthTokenService
{
    Task<AuthToken> SaveTokenAsync(TokenResponse rsp);
    Task<bool> IsValidRefreshTokenAsync(TokenRequest req);
}

[NoDirectUse]
public class AuthTokenService(AppDbContext dbContext) : IAuthTokenService
{
    public async Task<AuthToken> SaveTokenAsync(TokenResponse rsp)
    {
        var authToken = new AuthToken
        {
            AccessToken = rsp.AccessToken,
            AccessExpiry = rsp.AccessExpiry,
            RefreshToken = rsp.RefreshToken,
            RefreshExpiry = rsp.RefreshExpiry,
            UserId = Guid.Parse(rsp.UserId),
        };
        await dbContext.AuthTokens.AddAsync(authToken);
        await dbContext.SaveChangesAsync();
        return authToken;
    }

    public async Task<bool> IsValidRefreshTokenAsync(TokenRequest req)
    {
        var userId = Guid.Parse(req.UserId);
        return await dbContext.AuthTokens
            .AnyAsync(at => at.UserId == userId && at.RefreshToken == req.RefreshToken && at.RefreshExpiry > DateTime.UtcNow);
    }
}
