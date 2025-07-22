using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Options;

namespace Backend.Services.Email;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body, bool isHtml = false);
}

public class EmailService(IOptions<EmailSetting> emailSetting) : IEmailService
{
    private readonly EmailSetting _emailSetting = emailSetting.Value;

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = false)
    {
        var smtpClient = new SmtpClient(_emailSetting.SmtpServer)
        {
            Port = _emailSetting.SmtpPort,
            Credentials = new NetworkCredential(_emailSetting.SmtpUsername, _emailSetting.SmtpPassword),
            EnableSsl = true,
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_emailSetting.SenderEmail, _emailSetting.SenderName),
            Subject = subject,
            Body = body,
            IsBodyHtml = isHtml
        };
        mailMessage.To.Add(to);

        await smtpClient.SendMailAsync(mailMessage);
    }
}