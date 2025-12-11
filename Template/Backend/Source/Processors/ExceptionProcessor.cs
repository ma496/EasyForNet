namespace Backend.Processors;

using Npgsql;

public class ExceptionProcessor(IWebHostEnvironment env) : IGlobalPostProcessor
{
    public async Task PostProcessAsync(IPostProcessorContext context, CancellationToken ct)
    {
        if (!context.HasExceptionOccurred)
            return;

        if (context.ExceptionDispatchInfo.SourceException.GetType() == typeof(DbUpdateException))
        {
            context.MarkExceptionAsHandled(); //only if handling the exception here.

            var ex = (DbUpdateException)context.ExceptionDispatchInfo.SourceException;
            context.HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.HttpContext.Response.ContentType = "application/json";
            var error = ex.InnerException is PostgresException pgEx ? GetErrorMessage(pgEx) : (null, ex.Message, ErrorCodes.DatabaseError);
            var response = new
            {
                type = "https://www.rfc-editor.org/rfc/rfc7231#section-6.5.1",
                title = "Db Update Failed",
                status = 400,
                instance = context.HttpContext.Request.Path.Value,
                traceId = context.HttpContext.TraceIdentifier,
                errors = new[] { new { name = error.propertyName, reason = error.message, error.code } }
            };

            await context.HttpContext.Response.WriteAsJsonAsync(response, cancellationToken: ct);

            return;
        }

        if (typeof(Exception).IsAssignableFrom(context.ExceptionDispatchInfo.SourceException.GetType()))
        {
            context.MarkExceptionAsHandled(); //only if handling the exception here.

            var ex = context.ExceptionDispatchInfo.SourceException;
            context.HttpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.HttpContext.Response.ContentType = "application/json";
            var response = new
            {
                type = "https://www.rfc-editor.org/rfc/rfc7231#section-6.6.1",
                title = "Internal Server Error",
                status = 500,
                instance = context.HttpContext.Request.Path.Value,
                traceId = context.HttpContext.TraceIdentifier,
                errors = new[]
                {
                    new
                    {
                        reason = ex.Message,
                        code = ErrorCodes.InternalServerError,
                        stackTrace = env.IsDevelopment() ? ex.StackTrace : null
                    }
                }
            };

            await context.HttpContext.Response.WriteAsJsonAsync(response, cancellationToken: ct);

            return;
        }

        context.ExceptionDispatchInfo.Throw();
    }

    private static (string? propertyName, string message, string code) GetErrorMessage(PostgresException ex)
    {
        switch (ex.SqlState)
        {
            // Unique violation
            case "23505":
                var constraintName = ex.ConstraintName;
                if (string.IsNullOrEmpty(constraintName))
                    return (null, "A duplicate value was found.", ErrorCodes.DuplicateValue);

                // Extract property name from constraint name (e.g. "IX_Users_Username" -> "username")
                var property = constraintName.Split('_').Last().ToLower();
                return (property, $"A {property} with this value already exists.", ErrorCodes.DuplicatePropertyValue);

            // Not null violation
            case "23502":
                var columnName = ex.ColumnName?.ToLower();
                if (string.IsNullOrEmpty(columnName))
                    return (null, "A required field is missing.", ErrorCodes.RequiredFieldMissing);

                return (columnName, $"The {columnName} field is required.", ErrorCodes.RequiredPropertyFieldMissing);

            // Foreign key violation
            case "23503":
                return (null, "Referenced record does not exist.", ErrorCodes.ReferencedRecordNotFound);

            // Check violation
            case "23514":
                return (null, "Invalid value provided.", ErrorCodes.InvalidValueProvided);

            default:
                return (null, "A database error occurred.", ErrorCodes.DatabaseError);
        }
    }
}
