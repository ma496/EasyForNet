namespace Backend.Settings;

public class AuthSetting
{
    public JwtSetting Jwt { get; set; } = null!;
    public int AccessTokenValidity { get; set; } // in minutes
    public int RefreshTokenValidity { get; set; } // in hours
}

public class JwtSetting
{
    public string Key { get; set; } = null!;
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
}
