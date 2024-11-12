using Backend.Data.Entities;
using Microsoft.AspNetCore.Identity;

namespace Backend.Features;

public class LoginEndpoint : Endpoint<LoginRequest, TokenResponse>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;

    public LoginEndpoint(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public override void Configure()
    {
        Post("login");
        AllowAnonymous();
    }

    public override async Task HandleAsync(LoginRequest req, CancellationToken c)
    {
        var user = await _userManager.FindByNameAsync(req.Username);
        if (user == null)
            ThrowError(r => r.Username, "Invalid username or password");

        var result = await _signInManager.PasswordSignInAsync(req.Username, req.Password, false, false);
        if (!result.Succeeded)
            ThrowError(r => r.Username, "Invalid username or password");

        var roles = await _userManager.GetRolesAsync(user);
        var claims = await _userManager.GetClaimsAsync(user);

        Response = await CreateTokenWith<TokenService>(user.Id, u =>
        {
            u.Roles.AddRange(roles);
            u.Claims.AddRange(claims);
        });
    }
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
