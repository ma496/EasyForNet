namespace EasyForNetTool.Extensions;

/// <summary>
/// Provides extension methods for collection and enumerable operations.
/// </summary>
public static class EnumerableExt
{
    /// <summary>
    /// Filters a sequence based on a predicate, but only when the specified condition is true.
    /// </summary>
    public static IEnumerable<T> WhereIf<T>(this IEnumerable<T> source, bool condition, Func<T, bool> predicate)
    {
        if (condition)
        {
            return source.Where(predicate);
        }
        return source;
    }
}