namespace Backend.Features.Identity.Core;

using Backend.Attributes;
using Backend.Features.Identity.Core.Entities;

/// <summary>
/// Manages short-lived, single-use tokens (email verification, password reset, etc.) for <see cref="User"/> accounts.
/// </summary>
public interface ITokenService
{
    Task<Token> GenerateTokenAsync(User user);
    Task<bool> ValidateTokenAsync(string token);
    bool ValidateToken(Token token);
    Task UsedTokenAsync(Token token);
    Task<Token?> GetTokenAsync(string token);
    Task DeleteTokenAsync(Token token);
}

/// <summary>
/// EF Core implementation of <see cref="ITokenService"/> that issues, validates, consumes, and deletes single-use tokens.
/// </summary>
[NoDirectUse]
public class TokenService(AppDbContext dbContext) : ITokenService
{
    public async Task<Token> GenerateTokenAsync(User user)
    {
        var token = new Token { Value = Guid.NewGuid().ToString(), Expiry = DateTime.UtcNow.AddMinutes(15), UserId = user.Id };
        dbContext.Tokens.Add(token);
        await dbContext.SaveChangesAsync();
        return token;
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        return await dbContext
                     .Tokens
                     .AnyAsync(t => !t.IsUsed && t.Value == token && t.Expiry > DateTime.UtcNow);
    }

    public bool ValidateToken(Token token)
    {
        return !token.IsUsed && token.Expiry > DateTime.UtcNow;
    }

    public async Task UsedTokenAsync(Token token)
    {
        token.IsUsed = true;
        dbContext.Tokens.Update(token);
        await dbContext.SaveChangesAsync();
    }

    public async Task<Token?> GetTokenAsync(string token)
    {
        return await dbContext.Tokens.FirstOrDefaultAsync(t => t.Value == token);
    }

    public async Task DeleteTokenAsync(Token token)
    {
        dbContext.Tokens.Remove(token);
        await dbContext.SaveChangesAsync();
    }
}