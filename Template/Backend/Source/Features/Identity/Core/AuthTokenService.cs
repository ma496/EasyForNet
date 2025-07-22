using Backend.Data;
using Backend.Features.Identity.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Identity.Core;

public interface IAuthTokenService
{
    Task<AuthToken> SaveTokenAsync(TokenResponse rsp);
    Task<bool> IsValidRefreshTokenAsync(TokenRequest req);
    Task DeleteExpiredTokensAsync();
}

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

    public async Task DeleteExpiredTokensAsync()
    {
        await dbContext.AuthTokens.Where(at => at.RefreshExpiry < DateTime.UtcNow).ExecuteDeleteAsync();
    }
}
