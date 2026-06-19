namespace Backend.Features.Identity.Core;

/// <summary>
/// Configuration options that control sign-in behavior, such as whether the email must be verified before granting access.
/// </summary>
public class SigninSetting
{
    public bool IsEmailVerificationRequired { get; set; } = false;
}