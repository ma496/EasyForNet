using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using FluentValidation.Results;

namespace Backend.Extensions;

public static class EndpointExtension
{
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

    [DoesNotReturn]
    public static void ThrowError<TRequest, TResponse>(this Endpoint<TRequest, TResponse> endpoint, string errorMessage, string errorCode)
        where TRequest : notnull
    {
        endpoint.ThrowError(string.Empty, errorMessage, errorCode);
    }

    [DoesNotReturn]
    public static void ThrowError<TRequest, TResponse>(this Endpoint<TRequest, TResponse> endpoint, Expression<Func<TRequest, object?>> property, string errorMessage, string errorCode)
        where TRequest : notnull
    {
        var propertyName = property.Body.GetPropertyChain();
        endpoint.ThrowError(propertyName, errorMessage, errorCode);
    }
}