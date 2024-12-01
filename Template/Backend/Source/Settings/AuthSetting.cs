namespace Backend.Settings;

public class AuthSetting
{
    public string JwtKey { get; set; } = null!;
    public TimeSpan AccessTokenValidity { get; set; } // in minutes
    public TimeSpan RefreshTokenValidity { get; set; } // in hours
}