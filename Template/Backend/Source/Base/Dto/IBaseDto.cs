namespace Backend.Base.Dto;

public interface IBaseDto<TId>
{
    TId Id { get; set; }
}