namespace Backend.Base.Dto;

/// <summary>
/// FluentValidation validator for <see cref="ListRequestDto{TId}"/>, enforcing
/// sane pagination and sort direction values when a normal paged query is requested.
/// </summary>
public class ListRequestDtoValidator<TId> : Validator<ListRequestDto<TId>>
{
    public ListRequestDtoValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0)
            .When(x => !x.All && x.IncludeIds?.Count == 0);
        RuleFor(x => x.PageSize).GreaterThan(0)
            .When(x => !x.All && x.IncludeIds?.Count == 0);
        RuleFor(x => x.SortDirection).IsInEnum()
            .When(x => !string.IsNullOrWhiteSpace(x.SortField));
    }
}