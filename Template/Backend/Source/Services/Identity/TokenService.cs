using Backend.Data;
using Backend.Data.Entities.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Identity;

public interface ITokenService
{
    Task<Token> GenerateTokenAsync(User user);
    Task<bool> ValidateTokenAsync(string token);
    Task UsedTokenAsync(Token token);
    Task<Token?> GetTokenAsync(string token);
    Task DeleteTokenAsync(Token token);
    Task DeleteExpiredTokensAsync();
}

public class TokenService : ITokenService
{
    private readonly AppDbContext _context;

    public TokenService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Token> GenerateTokenAsync(User user)
    {
        var token = new Token { Value = Guid.NewGuid().ToString(), Expiry = DateTime.UtcNow.AddMinutes(15), UserId = user.Id };
        _context.Tokens.Add(token);
        await _context.SaveChangesAsync();
        return token;
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        return await _context
                     .Tokens
                     .AnyAsync(t => !t.IsUsed && t.Value == token && t.Expiry > DateTime.UtcNow);
    }

    public async Task UsedTokenAsync(Token token)
    {
        token.IsUsed = true;
        _context.Tokens.Update(token);
        await _context.SaveChangesAsync();
    }

    public async Task<Token?> GetTokenAsync(string token)
    {
        return await _context.Tokens.FirstOrDefaultAsync(t => t.Value == token);
    }

    public async Task DeleteTokenAsync(Token token)
    {
        _context.Tokens.Remove(token);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteExpiredTokensAsync()
    {
        await _context.Tokens.Where(t => t.Expiry < DateTime.UtcNow).ExecuteDeleteAsync();
    }
}