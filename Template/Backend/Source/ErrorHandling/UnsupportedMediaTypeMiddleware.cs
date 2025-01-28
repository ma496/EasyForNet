namespace Backend.ErrorHandling;

public class UnsupportedMediaTypeMiddleware
{
    private readonly RequestDelegate _next;

    public UnsupportedMediaTypeMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        await _next(context);

        if (context.Response.StatusCode == StatusCodes.Status415UnsupportedMediaType)
        {
            context.Response.ContentType = "application/json";
            var response = new
            {
                type = "https://www.rfc-editor.org/rfc/rfc7231#section-6.5.13",
                title = "Unsupported Media Type",
                status = StatusCodes.Status415UnsupportedMediaType,
                instance = context.Request.Path.Value,
                traceId = context.TraceIdentifier,
                errors = new[] { new { name = "Unsupported Media Type", reason = "The media type is not supported." } }
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
