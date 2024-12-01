namespace Backend.Settings;

public class AuthSetting
{
    public string JwtKey { get; set; } = null!;
    public int AccessTokenValidity { get; set; } // in minutes
    public int RefreshTokenValidity { get; set; } // in hours
}