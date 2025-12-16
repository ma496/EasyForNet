namespace Backend.Features.Identity.Endpoints.Account;

using Backend.External.Email;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using Backend.Settings;
using Microsoft.Extensions.Options;

sealed class SignupEndpoint(IUserService userService,
                            ITokenService tokenService,
                            IEmailBackgroundJobs emailBackgroundJobs,
                            IOptions<WebSetting> webSetting)
    : Endpoint<SignupRequest>
{
    public override void Configure()
    {
        Post("signup");
        Group<AccountGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(SignupRequest request, CancellationToken cancellationToken)
    {
        var existingUser = await userService.GetByEmailAsync(request.Email);
        if (existingUser != null)
        {
            ThrowError("Email already exists", ErrorCodes.EmailAlreadyExists);
        }

        var existingUsername = await userService.GetByUsernameAsync(request.Username);
        if (existingUsername != null)
        {
            ThrowError("Username already exists", ErrorCodes.UsernameAlreadyExists);
        }

        var user = new User
        {
            Email = request.Email,
            Username = request.Username,
            IsActive = true,
            IsEmailVerified = false
        };
        user.NormalizeProperties();

        await userService.CreateAsync(user, request.Password);

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

sealed class SignupRequest
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string ConfirmPassword { get; set; } = null!;
}

sealed class SignupValidator : Validator<SignupRequest>
{
    public SignupValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(50);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(100);

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(50);

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password);
    }
}
