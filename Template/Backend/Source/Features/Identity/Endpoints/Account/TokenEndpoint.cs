using Backend.ErrorHandling;
using Backend.Features.Identity.Core;
using FluentValidation;

namespace Backend.Features.Identity.Endpoints.Account;

sealed class TokenEndpoint(IUserService userService) : Endpoint<TokenReq, TokenResponse>
{
    public override void Configure()
    {
        Post("token");
        Group<AccountGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(TokenReq req, CancellationToken c)
    {
        var user = await (!req.IsEmail ? userService.GetByUsernameAsync(req.Username) : userService.GetByEmailAsync(req.Email));
        var errorMessage = !req.IsEmail ? "Username or password is invalid" : "Email or password is invalid";
        var errorCode = !req.IsEmail ? ErrorCodes.InvalidUsernamePassword : ErrorCodes.InvalidEmailPassword;
        if (user == null)
            this.ThrowError(errorMessage, errorCode);

        var result = await userService.ValidatePasswordAsync(user, req.Password);
        if (!result)
            this.ThrowError(errorMessage, errorCode);
        if (!user.IsActive)
            this.ThrowError("User is not active", ErrorCodes.UserNotActive);

        var roles = await userService.GetUserRolesAsync(user.Id);
        var permissions = await userService.GetUserPermissionsAsync(user.Id);

        var claims = Helper.CreateClaims(user, roles, permissions);

        // for cookie authentication
        await CookieAuth.SignInAsync(u =>
        {
            u.Claims.AddRange(claims);
        });

        // for jwt authentication
        Response = await CreateTokenWith<TokenService>(user.Id.ToString(), u =>
        {
            u.Claims.AddRange(claims);
        });

        await userService.UpdateLastLoginAsync(user.Id);
    }
}

sealed class TokenReq
{
    public bool IsEmail { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

sealed class LoginValidator : Validator<TokenReq>
{
    public LoginValidator()
    {
        When(x => !x.IsEmail, () =>
        {
            RuleFor(x => x.Username).NotEmpty().MinimumLength(3).MaximumLength(50);
        });
        When(x => x.IsEmail, () =>
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(100);
        });
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8).MaximumLength(50);
    }
}
