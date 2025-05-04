using System.Linq.Dynamic.Core;
using System.Linq.Expressions;
using Backend.Data.Entities.Base;
using Backend.Features.Base;
using Backend.Features.Base.Dto;

namespace Backend.Extensions;

public static class IQueryableExtension
{
    public static IQueryable<T> ToPage<T>(this IQueryable<T> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    public static IQueryable<T> Process<T>(this IQueryable<T> query, ListRequestDto request)
        where T : class
    {
        var processQuery = query;

        if (!string.IsNullOrWhiteSpace(request.SortField))
        {
            processQuery = processQuery.OrderBy($"{request.SortField} {(request.SortDirection == SortDirection.Desc ? "desc" : "asc")}");
        }
        else if (typeof(IUpdatableEntity).IsAssignableFrom(typeof(T)))
        {
            var sortExpression = $"{nameof(IUpdatableEntity.UpdatedAt)}.HasValue DESC, {nameof(IUpdatableEntity.UpdatedAt)} DESC";
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

        processQuery = !request.All
            ? processQuery
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            : processQuery;

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
