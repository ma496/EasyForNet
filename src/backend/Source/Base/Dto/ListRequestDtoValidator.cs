namespace Backend.Base.Dto;

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