namespace Backend.Processors;

using Backend.Settings;

public class ToLargePayloadProcessor(IOptions<PayloadSetting> payloadOptions) : IGlobalPreProcessor
{
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