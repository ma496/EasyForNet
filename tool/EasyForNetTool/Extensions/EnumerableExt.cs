namespace EasyForNetTool.Extensions;

public static class EnumerableExt
{
    public static IEnumerable<T> WhereIf<T>(this IEnumerable<T> source, bool condition, Func<T, bool> predicate)
    {
        if (condition)
        {
            return source.Where(predicate);
        }
        return source;
    }
}