using Hangfire;

namespace Backend.Services.Email;

public interface IEmailBackgroundJobs
{
    void Enqueue(string to, string subject, string body, bool isHtml = false);
}

public class EmailBackgroundJobs : IEmailBackgroundJobs
{
    private readonly IEmailService _emailService;

    public EmailBackgroundJobs(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public void Enqueue(string to, string subject, string body, bool isHtml = false)
    {
        BackgroundJob.Enqueue(() => _emailService.SendEmailAsync(to, subject, body, isHtml));
    }
}