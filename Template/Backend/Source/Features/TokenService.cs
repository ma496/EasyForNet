using Backend.Extensions;
using Backend.Services.Identity;

namespace Backend.Features;

public class TokenService : RefreshTokenService<TokenRequest, TokenResponse>
{
    private readonly IUserService _userService;

    public TokenService(IConfiguration config, IUserService userService)
    {
        _userService = userService;

        Setup(o =>
        {
            o.TokenSigningKey = config["Auth:JwtKey"];
            o.AccessTokenValidity = TimeSpan.FromMinutes(5);
            o.RefreshTokenValidity = TimeSpan.FromHours(4);

            o.Endpoint("refresh-token", ep =>
            {
                ep.Summary(s => s.Summary = "this is the refresh token endpoint");
            });
        });
    }

    public override async Task PersistTokenAsync(TokenResponse response)
    {
        // await Data.StoreToken(response);

        // this method will be called whenever a new access/refresh token pair is being generated.
        // store the tokens and expiry dates however you wish for the purpose of verifying
        // future refresh requests.        
    }

    public override async Task RefreshRequestValidationAsync(TokenRequest req)
    {
        // if (!await Data.TokenIsValid(req.UserId, req.RefreshToken))
        //     AddError(r => r.RefreshToken, "Refresh token is invalid!");

        // validate the incoming refresh request by checking the token and expiry against the
        // previously stored data. if the token is not valid and a new token pair should
        // not be created, simply add validation errors using the AddError() method.
        // the failures you add will be sent to the requesting client. if no failures are added,
        // validation passes and a new token pair will be created and sent to the client.        
    }

    /// <summary>
    /// specify the user privileges to be embedded in the jwt when a refresh request is
    /// received and validation has passed. this only applies to renewal/refresh requests
    /// received to the refresh endpoint and not the initial jwt creation.          
    /// </summary>
    /// <param name="request"></param>
    /// <param name="privileges"></param>
    /// <returns></returns>
    public override async Task SetRenewalPrivilegesAsync(TokenRequest request, UserPrivileges privileges)
    {
        var user = await _userService.GetByIdAsync(Guid.Parse(request.UserId));
        if (user == null)
            ThrowError(r => r.UserId, "User not found");

        var roles = await _userService.GetUserRolesAsync(user.Id);
        var permissions = await _userService.GetUserPermissionsAsync(user.Id);
        privileges.AddUserClaims(user, roles, permissions);
    }
}
