namespace Backend.Data.Entities.Base;

public interface IBaseEntity<TId>
{
    TId Id { get; set; }
}