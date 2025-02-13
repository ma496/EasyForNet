using Backend.Features.Account;
using Backend.Services.Identity;
using FluentValidation;

namespace Template.Backend.Source.Features.Account;

sealed class LogoutEndpoint : Endpoint<LogoutRequest>
{
    private readonly IAuthTokenService _authTokenService;

    public LogoutEndpoint(IAuthTokenService authTokenService)
    {
        _authTokenService = authTokenService;
    }

    public override void Configure()
    {
        Post("logout");
        Group<AccountGroup>();
    }

    public override async Task HandleAsync(LogoutRequest req, CancellationToken c)
    {
        await _authTokenService.DeleteTokenAsync(req.UserId, req.AccessToken, req.RefreshToken);
        await SendAsync(new { Message = "Logged out successfully" });
    }
}

sealed class LogoutRequest
{
    public string UserId { get; set; } = null!;
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}

sealed class LogoutValidator : Validator<LogoutRequest>
{
    public LogoutValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.AccessToken).NotEmpty();
        RuleFor(x => x.RefreshToken).NotEmpty();
    }
}
