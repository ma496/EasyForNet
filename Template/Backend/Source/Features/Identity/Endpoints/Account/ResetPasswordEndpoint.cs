namespace Backend.Features.Identity.Endpoints.Account;

using Backend.Features.Identity.Core;

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
            ThrowError("Token is invalid", ErrorCodes.InvalidToken);
        }
        var isTokenValid = await tokenService.ValidateTokenAsync(token.Value);
        if (!isTokenValid)
        {
            ThrowError("Token is expired", ErrorCodes.TokenExpired);
        }
        var user = await userService.GetByIdAsync(token.UserId);
        if (user == null)
        {
            await Send.NotFoundAsync(cancellationToken);
            return;
        }
        user.PasswordHash = passwordHasher.HashPassword(request.Password);

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        await userService.UpdateAsync(user);
        await tokenService.UsedTokenAsync(token);
        await transaction.CommitAsync(cancellationToken);

        await Send.OkAsync(cancellation: cancellationToken);
    }
}

sealed class ResetPasswordRequest
{
    public string Token { get; set; } = null!;
    public string Password { get; set; } = null!;
}
