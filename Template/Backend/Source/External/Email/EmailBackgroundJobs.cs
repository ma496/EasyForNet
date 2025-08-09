using Backend.Attributes;
using Hangfire;

namespace Backend.External.Email;

public interface IEmailBackgroundJobs
{
    void Enqueue(string to, string subject, string body, bool isHtml = false);
}

[NoDirectUse]
public class EmailBackgroundJobs(IEmailService emailService) : IEmailBackgroundJobs
{
    public void Enqueue(string to, string subject, string body, bool isHtml = false)
    {
        BackgroundJob.Enqueue(() => emailService.SendEmailAsync(to, subject, body, isHtml));
    }
}