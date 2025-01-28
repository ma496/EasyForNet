using Backend.Services.Identity;

namespace Backend.Features.Account;

sealed class ResetPasswordEndpoint : Endpoint<ResetPasswordRequest>
{
    private readonly ITokenService _tokenService;
    private readonly IUserService _userService;
    private readonly IPasswordHasher _passwordHasher;

    public ResetPasswordEndpoint(ITokenService tokenService, IUserService userService, IPasswordHasher passwordHasher)
    {
        _tokenService = tokenService;
        _userService = userService;
        _passwordHasher = passwordHasher;
    }

    public override void Configure()
    {
        Post("reset-password");
        Group<AccountGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        var token = await _tokenService.GetTokenAsync(request.Token);
        if (token == null)
        {
            ThrowError("Token is invalid.");
            return;
        }
        var isTokenValid = await _tokenService.ValidateTokenAsync(token.Value);
        if (!isTokenValid)
        {
            ThrowError("Token expired.");
        }
        var user = await _userService.GetByIdAsync(token.UserId);
        if (user == null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }
        user.PasswordHash = _passwordHasher.HashPassword(request.Password);
        await _userService.UpdateAsync(user);

        await SendOkAsync(cancellation: cancellationToken);
    }
}

sealed class ResetPasswordRequest
{
    public string Token { get; set; } = null!;
    public string Password { get; set; } = null!;
}
