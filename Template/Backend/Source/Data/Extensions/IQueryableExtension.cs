namespace Backend.Data.Extensions;

public static class IQueryableExtension
{
    public static IQueryable<T> ToPage<T>(this IQueryable<T> query, int page, int pageSize)
        where T : class
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }
}
