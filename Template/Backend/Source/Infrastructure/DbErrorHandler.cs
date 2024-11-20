using Npgsql;

namespace Backend.Infrastructure;

public static class DbErrorHandler
{
    public static (string? propertyName, string message) GetUniqueViolationMessage(PostgresException ex)
    {
        // Extract constraint name from the error message
        var constraintName = ex.ConstraintName;
        
        if (string.IsNullOrEmpty(constraintName))
            return (null, "A duplicate value was found.");

        // Map constraint names to user-friendly messages
        return constraintName switch
        {
            "IX_Users_Username" => ("username", "This username is already taken."),
            "IX_Users_Email" => ("email", "This email is already registered."),
            "IX_Roles_Name" => ("name", "A role with this name already exists."),
            "IX_Permissions_Name" => ("name", "A permission with this name already exists."),
            _ => (null, "A duplicate value was found.")
        };
    }
}
