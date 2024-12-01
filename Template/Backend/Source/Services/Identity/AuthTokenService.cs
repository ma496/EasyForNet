using Backend.Data;
using Backend.Data.Entities.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Identity;

public class AuthTokenService : IAuthTokenService
{
    private readonly AppDbContext _dbContext;

    public AuthTokenService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

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
        await _dbContext.AuthTokens.AddAsync(authToken);
        await _dbContext.SaveChangesAsync();
        return authToken;
    }

    public async Task<bool> IsValidRefreshTokenAsync(TokenRequest req)
    {
        var userId = Guid.Parse(req.UserId);
        return await _dbContext.AuthTokens
            .AnyAsync(at => at.UserId == userId && at.RefreshToken == req.RefreshToken && at.RefreshExpiry > DateTime.UtcNow);
    }
}
