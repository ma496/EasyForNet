namespace Template.Backend.Source.Features.Base.Dto;

public class ListRequestDto
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortField { get; set; }
    public SortDirection SortDirection { get; set; } = SortDirection.Asc;
    public string? Search { get; set; }
    public bool All { get; set; } = false;
}
