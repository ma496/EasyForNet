namespace Backend.Base.Dto;

public interface IBaseDto
{}

public interface IBaseDto<TId> : IBaseDto
{
    TId Id { get; set; }
}