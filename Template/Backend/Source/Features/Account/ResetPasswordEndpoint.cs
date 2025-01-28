using Backend.Data;
using Backend.Services.Identity;

namespace Backend.Features.Account;

sealed class ResetPasswordEndpoint : Endpoint<ResetPasswordRequest>
{
    private readonly ITokenService _tokenService;
    private readonly IUserService _userService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly AppDbContext _dbContext;

    public ResetPasswordEndpoint(ITokenService tokenService, IUserService userService, IPasswordHasher passwordHasher, AppDbContext dbContext)
    {
        _tokenService = tokenService;
        _userService = userService;
        _passwordHasher = passwordHasher;
        _dbContext = dbContext;
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

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);
        await _userService.UpdateAsync(user);
        await _tokenService.UsedTokenAsync(token);
        await transaction.CommitAsync(cancellationToken);

        await SendOkAsync(cancellation: cancellationToken);
    }
}

sealed class ResetPasswordRequest
{
    public string Token { get; set; } = null!;
    public string Password { get; set; } = null!;
}
