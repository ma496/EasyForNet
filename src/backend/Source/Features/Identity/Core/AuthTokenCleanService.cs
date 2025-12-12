namespace Backend.Features.Identity.Core;

public interface IAuthTokenCleanService
{
    Task DeleteExpiredTokensAsync();
}

public class AuthTokenCleanService(AppDbContext dbContext) : IAuthTokenCleanService
{
    public async Task DeleteExpiredTokensAsync()
    {
        await dbContext.AuthTokens.Where(at => at.RefreshExpiry < DateTime.UtcNow).ExecuteDeleteAsync();
    }
}