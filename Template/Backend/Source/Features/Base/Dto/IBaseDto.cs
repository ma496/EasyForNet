namespace Backend.Features.Base.Dto;

public interface IBaseDto<TId>
{
    TId Id { get; set; }
}