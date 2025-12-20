namespace Backend.Features.Identity.Endpoints.Account;

using Backend.Features.Identity.Core;

sealed class VerifyEmailEndpoint(ITokenService tokenService, IUserService userService, AppDbContext dbContext)
    : Endpoint<VerifyEmailRequest, EmptyResponse>
{
    public override void Configure()
    {
        Post("verify-email");
        Group<AccountGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(VerifyEmailRequest request, CancellationToken cancellationToken)
    {
        var token = await tokenService.GetTokenAsync(request.Token);
        if (token == null || !tokenService.ValidateToken(token))
        {
            ThrowError("Invalid or expired token", ErrorCodes.InvalidToken);
        }

        var user = await userService.GetByIdAsync(token.UserId);
        if (user == null)
        {
            ThrowError("User not found", ErrorCodes.UserNotFound);
            return;
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        user.IsEmailVerified = true;
        await userService.UpdateAsync(user);
        await tokenService.UsedTokenAsync(token);

        await transaction.CommitAsync(cancellationToken);

        await Send.OkAsync(cancellationToken);
    }
}

sealed class VerifyEmailRequest
{
    public string Token { get; set; } = null!;
}

sealed class VerifyEmailValidator : Validator<VerifyEmailRequest>
{
    public VerifyEmailValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty();
    }
}
