namespace Backend.External.Email;

using Backend.Attributes;
using Hangfire;

/// <summary>
/// Enqueues outgoing email messages onto the Hangfire job queue so that
/// delivery happens asynchronously off the request thread.
/// </summary>
public interface IEmailBackgroundJobs
{
    /// <summary>
    /// Schedules an email for asynchronous delivery via Hangfire.
    /// </summary>
    /// <param name="to">Recipient email address.</param>
    /// <param name="subject">Email subject line.</param>
    /// <param name="body">Email body content.</param>
    /// <param name="isHtml">Indicates whether the body is HTML; defaults to plain text.</param>
    void Enqueue(string to, string subject, string body, bool isHtml = false);
}

/// <summary>
/// Default <see cref="IEmailBackgroundJobs"/> implementation that delegates
/// to Hangfire's <see cref="BackgroundJob.Enqueue{T}(System.Linq.Expressions.Expression{System.Action{T}})"/>.
/// </summary>
[NoDirectUse]
public class EmailBackgroundJobs(IEmailService emailService) : IEmailBackgroundJobs
{
    /// <inheritdoc/>
    public void Enqueue(string to, string subject, string body, bool isHtml = false)
    {
        BackgroundJob.Enqueue(() => emailService.SendEmailAsync(to, subject, body, isHtml));
    }
}