namespace Backend.Features.Identity;

using Backend.Attributes;
using Backend.Features.Identity.Core;

[BypassNoDirectUse]
public class IdentityFeature : IFeature
{
    public static void AddServices(IServiceCollection services, ConfigurationManager configuration)
    {
        // configure settings
        services.Configure<AuthSetting>(configuration.GetSection("Auth"));
        services.Configure<SigninSetting>(configuration.GetSection("Signin"));
        
        // configure services
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IPermissionService, PermissionService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IAuthTokenService, AuthTokenService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthTokenCleanService, AuthTokenCleanService>();
        services.AddScoped<ITokenCleanService, TokenCleanService>();
    }
}
