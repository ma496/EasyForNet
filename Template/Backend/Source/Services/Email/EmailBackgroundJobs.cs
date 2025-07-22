using Hangfire;

namespace Backend.Services.Email;

public interface IEmailBackgroundJobs
{
    void Enqueue(string to, string subject, string body, bool isHtml = false);
}

public class EmailBackgroundJobs(IEmailService emailService) : IEmailBackgroundJobs
{
    public void Enqueue(string to, string subject, string body, bool isHtml = false)
    {
        BackgroundJob.Enqueue(() => emailService.SendEmailAsync(to, subject, body, isHtml));
    }
}