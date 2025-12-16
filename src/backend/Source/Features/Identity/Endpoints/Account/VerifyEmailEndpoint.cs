namespace Backend.Features.Identity.Endpoints.Account;

using Backend.Features.Identity.Core;

sealed class VerifyEmailEndpoint(ITokenService tokenService, IUserService userService)
    : Endpoint<VerifyEmailRequest>
{
    public override void Configure()
    {
        Post("verify-email");
        Group<AccountGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(VerifyEmailRequest request, CancellationToken cancellationToken)
    {
        var isValid = await tokenService.ValidateTokenAsync(request.Token);
        if (!isValid)
        {
            ThrowError("Invalid or expired token", ErrorCodes.InvalidToken);
        }

        var token = await tokenService.GetTokenAsync(request.Token);
        if (token == null)
        {
            ThrowError("Invalid token", ErrorCodes.InvalidToken);
            return; // checking null to avoid compiler warning, though ValidateTokenAsync usually implies existence
        }

        var user = await userService.GetByIdAsync(token.UserId);
        if (user == null)
        {
            ThrowError("User not found", ErrorCodes.UserNotFound);
            return;
        }

        user.IsEmailVerified = true;
        await userService.UpdateAsync(user);

        await tokenService.UsedTokenAsync(token);

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
