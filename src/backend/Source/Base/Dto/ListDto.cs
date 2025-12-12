namespace Backend.Base.Dto;

public class ListDto<T>
{
    public List<T> Items { get; set; } = [];
    public int Total { get; set; }
}