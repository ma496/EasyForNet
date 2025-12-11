namespace Backend.Features.Identity.Core;

using Backend.Attributes;
using Backend.Features.Identity.Core.Entities;

public interface ITokenService
{
    Task<Token> GenerateTokenAsync(User user);
    Task<bool> ValidateTokenAsync(string token);
    Task UsedTokenAsync(Token token);
    Task<Token?> GetTokenAsync(string token);
    Task DeleteTokenAsync(Token token);
}

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