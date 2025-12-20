namespace Backend.Features.Identity.Endpoints.Account;

using Backend.External.Email;
using Backend.Features.Identity.Core;
using Backend.Settings;
using Microsoft.Extensions.Options;

sealed class ResendVerifyEmailEndpoint(IUserService userService,
                               ITokenService tokenService,
                               IEmailBackgroundJobs emailBackgroundJobs,
                               IOptions<WebSetting> webSetting,
                               IOptions<SigninSetting> signinSetting)
    : Endpoint<ResendVerifyEmailRequest, EmptyResponse>
{
    public override void Configure()
    {
        Post("resend-verify-email");
        Group<AccountGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(ResendVerifyEmailRequest request, CancellationToken cancellationToken)
    {
        if (!signinSetting.Value.IsEmailVerificationRequired)
        {
            await Send.OkAsync(cancellationToken);
            return;
        }

        var user = await userService.GetByEmailAsync(request.Email);
        if (user == null)
        {
            // For security reasons, don't reveal that the user doesn't exist
            await Send.OkAsync(cancellationToken);
            return;
        }

        if (user.IsEmailVerified)
        {
            await Send.OkAsync(cancellationToken);
            return;
        }

        // Generate verification token
        var token = await tokenService.GenerateTokenAsync(user);

        // Send verification email
        emailBackgroundJobs.Enqueue(user.Email, "Verify Email",
            @$"
            <div>
                <p>Click the link below to verify your email:</p>
                <a href=""{webSetting.Value.Url}/verify-email?token={token.Value}"">Verify Email</a>
            </div>", true);

        await Send.OkAsync(cancellationToken);
    }
}

sealed class ResendVerifyEmailRequest
{
    public string Email { get; set; } = null!;
}

sealed class ResendVerifyEmailValidator : Validator<ResendVerifyEmailRequest>
{
    public ResendVerifyEmailValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
    }
}
