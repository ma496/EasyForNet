namespace Backend.Features.Base.Dto;

public abstract class BaseDto<TId> : IBaseDto<TId>
{
    public TId Id { get; set; } = default!;
}