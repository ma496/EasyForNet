namespace Backend.Features.Identity.Core;

public interface ITokenCleanService
{
    Task DeleteExpiredTokensAsync();
}

public class TokenCleanService(AppDbContext dbContext) : ITokenCleanService
{
    public async Task DeleteExpiredTokensAsync()
    {
        await dbContext.Tokens.Where(t => t.Expiry < DateTime.UtcNow).ExecuteDeleteAsync();
    }
}