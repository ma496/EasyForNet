using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Backend.ErrorHandling;

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
            var error = ex.InnerException is PostgresException pgEx ? GetErrorMessage(pgEx) : (null, ex.Message);
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

    private static (string? propertyName, string message) GetErrorMessage(PostgresException ex)
    {
        switch (ex.SqlState)
        {
            // Unique violation
            case "23505":
                var constraintName = ex.ConstraintName;
                if (string.IsNullOrEmpty(constraintName))
                    return (null, "A duplicate value was found.");

                // Extract property name from constraint name (e.g. "IX_Users_Username" -> "username")
                var property = constraintName.Split('_').Last().ToLower();
                return (property, $"A {property} with this value already exists.");

            // Not null violation
            case "23502":
                var columnName = ex.ColumnName?.ToLower();
                if (string.IsNullOrEmpty(columnName))
                    return (null, "A required field is missing.");

                return (columnName, $"The {columnName} field is required.");

            // Foreign key violation
            case "23503":
                return (null, "Referenced record does not exist.");

            // Check violation
            case "23514":
                return (null, "Invalid value provided.");

            default:
                return (null, "A database error occurred.");
        }
    }
}
