namespace Backend.Base.Dto;

public abstract class BaseDto<TId> : IBaseDto<TId>
{
    public TId Id { get; set; } = default!;
}