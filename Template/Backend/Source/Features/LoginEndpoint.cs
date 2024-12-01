using Backend.Extensions;
using Backend.Services.Identity;

namespace Backend.Features;

public class LoginEndpoint : Endpoint<LoginRequest, TokenResponse>
{
    private readonly IUserService _userService;

    public LoginEndpoint(IUserService userService)
    {
        _userService = userService;
    }

    public override void Configure()
    {
        Post("login");
        AllowAnonymous();
    }

    public override async Task HandleAsync(LoginRequest req, CancellationToken c)
    {
        var user = await _userService.GetByUsernameAsync(req.Username);
        if (user == null)
            ThrowError(r => r.Username, "Invalid username or password");

        var result = await _userService.ValidatePasswordAsync(user, req.Password);
        if (!result)
            ThrowError(r => r.Username, "Invalid username or password");

        var roles = await _userService.GetUserRolesAsync(user.Id);
        var permissions = await _userService.GetUserPermissionsAsync(user.Id);

        Response = await CreateTokenWith<TokenService>(user.Id.ToString(), u =>
        {
            u.AddUserClaims(user, roles, permissions);
        });
    }
}

public class LoginRequest
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}
