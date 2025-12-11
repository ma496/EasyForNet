namespace Backend.Extensions;

using System.Linq.Dynamic.Core;
using System.Linq.Expressions;
using Backend.Data.Entities.Base;

public static class IQueryableExtension
{
    public static IQueryable<T> Process<T, TId>(this IQueryable<T> query, ListRequestDto<TId> request)
        where T : class, IBaseEntity<TId>
    {
        var processQuery = query;

        if (!string.IsNullOrWhiteSpace(request.SortField))
        {
            processQuery = processQuery.OrderBy($"{request.SortField} {(request.SortDirection == SortDirection.Desc ? "desc" : "asc")}");
        }
        else if (typeof(IUpdatableEntity).IsAssignableFrom(typeof(T)))
        {
            var sortExpression = $"{nameof(IUpdatableEntity.UpdatedAt)} DESC";
            if (typeof(ICreatableEntity).IsAssignableFrom(typeof(T))
                && typeof(T).GetProperty(nameof(IBaseEntity<object>.Id)) != null)
            {
                sortExpression += $", {nameof(ICreatableEntity.CreatedAt)} DESC, {nameof(IBaseEntity<object>.Id)} DESC";
            }
            else if (typeof(T).GetProperty(nameof(IBaseEntity<object>.Id)) != null)
            {
                sortExpression += $", {nameof(IBaseEntity<object>.Id)} DESC";
            }
            processQuery = processQuery.OrderBy(sortExpression);
        }
        else if (typeof(ICreatableEntity).IsAssignableFrom(typeof(T)))
        {
            var sortExpression = $"{nameof(ICreatableEntity.CreatedAt)} desc";
            if (typeof(T).GetProperty(nameof(IBaseEntity<object>.Id)) != null)
            {
                sortExpression = $"{nameof(ICreatableEntity.CreatedAt)} desc, {nameof(IBaseEntity<object>.Id)} desc";
            }
            processQuery = processQuery.OrderBy(sortExpression);
        }
        else if (typeof(T).GetProperty(nameof(IBaseEntity<object>.Id)) != null)
        {
            processQuery = processQuery.OrderBy($"{nameof(IBaseEntity<object>.Id)} desc");
        }

        if (request.IncludeIds?.Count > 0)
        {
            processQuery = processQuery.Where(x => request.IncludeIds.Contains(x.Id));
        }

        processQuery = request.All || request.IncludeIds?.Count > 0
            ? processQuery
            : processQuery
                .Skip<T>((request.Page - 1) * request.PageSize)
                .Take<T>(request.PageSize);

        return processQuery;
    }

    public static IQueryable<T> WhereIf<T>(this IQueryable<T> query, bool condition, Expression<Func<T, bool>> predicate)
    {
        return condition ? query.Where(predicate) : query;
    }

    public static IQueryable<T> OrderIf<T>(this IQueryable<T> query, bool condition, Expression<Func<T, object>> expression, SortDirection direction = SortDirection.Asc)
    {
        if (!condition)
        {
            return query;
        }

        return direction == SortDirection.Desc
            ? query.OrderByDescending(expression)
            : query.OrderBy(expression);
    }
}
