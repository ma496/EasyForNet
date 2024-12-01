using Npgsql;

namespace Backend.DbErrorHandling;

public static class DbErrorHandler
{
    public static (string? propertyName, string message) GetErrorMessage(PostgresException ex)
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
