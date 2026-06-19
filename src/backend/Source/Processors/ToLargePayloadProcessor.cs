namespace Backend.Processors;

using Backend.Settings;

/// <summary>
/// Global FastEndpoints pre-processor that rejects incoming requests whose declared
/// content length exceeds the configured maximum payload size, returning a 413
/// Payload Too Large response in the project's standard error format.
/// </summary>
public class ToLargePayloadProcessor(IOptions<PayloadSetting> payloadOptions) : IGlobalPreProcessor
{
    /// <summary>
    /// Inspects the request's content length and, when it exceeds the configured
    /// maximum, short-circuits the pipeline with a 413 response payload.
    /// </summary>
    public async Task PreProcessAsync(IPreProcessorContext context, CancellationToken ct)
    {
        var maxSize = payloadOptions.Value.MaximumSize;
        var contentLength = context.HttpContext.Request.ContentLength;
        if (contentLength is { } length && length > maxSize)
        {
            context.HttpContext.Response.StatusCode = StatusCodes.Status413PayloadTooLarge;
            context.HttpContext.Response.ContentType = "application/json";
            var response = new
            {
                type = "https://www.rfc-editor.org/rfc/rfc7231#section-6.5.11",
                title = "Payload Too Large",
                status = StatusCodes.Status413PayloadTooLarge,
                instance = context.HttpContext.Request.Path.Value,
                traceId = context.HttpContext.TraceIdentifier,
                errors = new[] { new { name = "Payload", reason = "Request body too large", code = ErrorCodes.PayloadTooLarge } }
            };
            await context.HttpContext.Response.WriteAsJsonAsync(response, cancellationToken: ct);
        }
    }
}