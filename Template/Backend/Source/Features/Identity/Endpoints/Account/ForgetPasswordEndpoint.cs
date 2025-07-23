using Backend.External.Email;
using Backend.Features.Identity.Core;
using Backend.Settings;
using FluentValidation;
using Microsoft.Extensions.Options;

namespace Backend.Features.Identity.Endpoints.Account;

sealed class ForgetPasswordEndpoint : Endpoint<ForgetPasswordRequest>
{
    private readonly ITokenService _tokenService;
    private readonly IUserService _userService;
    private readonly IEmailBackgroundJobs _emailBackgroundJobs;
    private readonly IOptions<WebSetting> _webSetting;

    public ForgetPasswordEndpoint(ITokenService tokenService, IUserService userService, IEmailBackgroundJobs emailBackgroundJobs, IOptions<WebSetting> webSetting)
    {
        _tokenService = tokenService;
        _userService = userService;
        _emailBackgroundJobs = emailBackgroundJobs;
        _webSetting = webSetting;
    }

    public override void Configure()
    {
        Post("forget-password");
        Group<AccountGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(ForgetPasswordRequest request, CancellationToken cancellationToken)
    {
        var user = await _userService.GetByEmailAsync(request.Email);
        if (user == null)
        {
            // Return success even if email doesn't exist to prevent email enumeration
            await SendOkAsync(cancellationToken);
            return;
        }

        // Generate reset token
        var resetToken = await _tokenService.GenerateTokenAsync(user);

        // Send email with reset token
        _emailBackgroundJobs.Enqueue(user.Email, "Reset Password",
            @$"
            <div>
                <p>Click the link below to reset your password:</p>
                <a href=""{_webSetting.Value.Url}/reset-password?token={resetToken.Value}"">Reset Password</a>
            </div>", true);

        await SendOkAsync(cancellationToken);
    }
}

sealed class ForgetPasswordRequest
{
    public string Email { get; set; } = null!;
}

sealed class ForgetPasswordValidator : Validator<ForgetPasswordRequest>
{
    public ForgetPasswordValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(100);
    }
}