namespace EasyForNetTool;

/// <summary>
/// Represents an exception that should be displayed directly to the user with a friendly message,
/// rather than a technical stack trace.
/// </summary>
public class UserFriendlyException(string message) : Exception(message)
{
}
