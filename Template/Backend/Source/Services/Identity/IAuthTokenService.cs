using Backend.Data.Entities.Identity;

namespace Backend.Services.Identity;

public interface IAuthTokenService
{
    Task<AuthToken> SaveTokenAsync(TokenResponse rsp);
    Task<bool> IsValidRefreshTokenAsync(TokenRequest req);
}
