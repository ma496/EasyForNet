using FluentValidation;

namespace Template.Backend.Source.Features.Base.Dto;

public class ListRequestDtoValidator : Validator<ListRequestDto>
{
    public ListRequestDtoValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
        RuleFor(x => x.SortDirection).IsInEnum()
            .When(x => !string.IsNullOrWhiteSpace(x.SortField));
    }
}