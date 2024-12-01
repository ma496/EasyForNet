using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Backend.DbErrorHandling;

public class DbUpdateExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public DbUpdateExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DbUpdateException ex)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.Response.ContentType = "application/json";
            var error = ex.InnerException is PostgresException pgEx ? DbErrorHandler.GetErrorMessage(pgEx) : (null, ex.Message);
            var response = new
            {
                type = "https://www.rfc-editor.org/rfc/rfc7231#section-6.5.1",
                title = "Db Update Failed",
                status = 400,
                instance = context.Request.Path.Value,
                traceId = context.TraceIdentifier,
                errors = new[] { new { name = error.propertyName, reason = error.message } }
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
