namespace Backend.Data.Entities.Base;

public interface IBaseEntity
{}

public interface IBaseEntity<TId> : IBaseEntity
{
    TId Id { get; set; }
}