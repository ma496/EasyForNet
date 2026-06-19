namespace Backend.Extensions;

using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using FluentValidation.Results;

/// <summary>
/// Helper extensions for FastEndpoints that allow endpoints to raise a
/// validation failure in a single call, attaching a property name, message,
/// and machine-readable error code.
/// </summary>
public static class EndpointExtension
{
    /// <summary>
    /// Adds a validation failure to the endpoint and throws a
    /// <see cref="ValidationFailureException"/> to short-circuit the request.
    /// </summary>
    /// <param name="endpoint">The FastEndpoints endpoint raising the error.</param>
    /// <param name="propertyName">Name of the offending property, or empty for a request-level error.</param>
    /// <param name="errorMessage">Human-readable error message.</param>
    /// <param name="errorCode">Machine-readable error code from <see cref="ErrorHandling.ErrorCodes"/>.</param>
    [DoesNotReturn]
    public static void ThrowError<TRequest, TResponse>(this Endpoint<TRequest, TResponse> endpoint, string propertyName, string errorMessage, string errorCode)
        where TRequest : notnull
    {
        var validationFailure = new ValidationFailure(propertyName, errorMessage)
        {
            ErrorCode = errorCode
        };

        endpoint.ValidationFailures.Add(validationFailure);

        throw new ValidationFailureException(endpoint.ValidationFailures, $"{nameof(ThrowError)}() called!");
    }

    /// <summary>
    /// Raises a request-level (non-property-specific) validation error on the endpoint.
    /// </summary>
    /// <param name="endpoint">The FastEndpoints endpoint raising the error.</param>
    /// <param name="errorMessage">Human-readable error message.</param>
    /// <param name="errorCode">Machine-readable error code from <see cref="ErrorHandling.ErrorCodes"/>.</param>
    [DoesNotReturn]
    public static void ThrowError<TRequest, TResponse>(this Endpoint<TRequest, TResponse> endpoint, string errorMessage, string errorCode)
        where TRequest : notnull
    {
        endpoint.ThrowError(string.Empty, errorMessage, errorCode);
    }

    /// <summary>
    /// Raises a property-scoped validation error, deriving the property name
    /// from the supplied expression.
    /// </summary>
    /// <param name="endpoint">The FastEndpoints endpoint raising the error.</param>
    /// <param name="property">Expression selecting the offending property on the request.</param>
    /// <param name="errorMessage">Human-readable error message.</param>
    /// <param name="errorCode">Machine-readable error code from <see cref="ErrorHandling.ErrorCodes"/>.</param>
    [DoesNotReturn]
    public static void ThrowError<TRequest, TResponse>(this Endpoint<TRequest, TResponse> endpoint, Expression<Func<TRequest, object?>> property, string errorMessage, string errorCode)
        where TRequest : notnull
    {
        var propertyName = property.Body.GetPropertyChain();
        endpoint.ThrowError(propertyName, errorMessage, errorCode);
    }
}