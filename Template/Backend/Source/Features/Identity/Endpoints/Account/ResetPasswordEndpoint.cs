using Backend.Data;
using Backend.ErrorHandling;
using Backend.Features.Identity.Core;

namespace Backend.Features.Identity.Endpoints.Account;

sealed class ResetPasswordEndpoint(ITokenService tokenService,
                                   IUserService userService,
                                   IPasswordHasher passwordHasher,
                                   AppDbContext dbContext)
    : Endpoint<ResetPasswordRequest>
{
    public override void Configure()
    {
        Post("reset-password");
        Group<AccountGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        var token = await tokenService.GetTokenAsync(request.Token);
        if (token == null)
        {
            this.ThrowError("Token is invalid", ErrorCodes.InvalidToken);
        }
        var isTokenValid = await tokenService.ValidateTokenAsync(token.Value);
        if (!isTokenValid)
        {
            this.ThrowError("Token is expired", ErrorCodes.TokenExpired);
        }
        var user = await userService.GetByIdAsync(token.UserId);
        if (user == null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }
        user.PasswordHash = passwordHasher.HashPassword(request.Password);

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        await userService.UpdateAsync(user);
        await tokenService.UsedTokenAsync(token);
        await transaction.CommitAsync(cancellationToken);

        await SendOkAsync(cancellation: cancellationToken);
    }
}

sealed class ResetPasswordRequest
{
    public string Token { get; set; } = null!;
    public string Password { get; set; } = null!;
}
