namespace Backend.External.Email;

/// <summary>
/// Strongly-typed options bound from the <c>EmailSettings</c> configuration
/// section that describe the SMTP server and sender used to deliver email.
/// </summary>
public class EmailSetting
{
    public string SmtpServer { get; set; } = string.Empty;
    public int SmtpPort { get; set; }
    public string SmtpUsername { get; set; } = string.Empty;
    public string SmtpPassword { get; set; } = string.Empty;
    public string SenderEmail { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
}