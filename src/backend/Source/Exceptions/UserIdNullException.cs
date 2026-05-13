namespace Backend.Exceptions;

public class UserIdNullException(string message = "User ID is null.")
    : Exception(message)
{
}
