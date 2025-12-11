namespace Backend.Data.Entities.Base;

public abstract class BaseEntity : IBaseEntity
{
}

public abstract class BaseEntity<TId> : IBaseEntity<TId>
{
    public TId Id { get; set; } = default!;
}