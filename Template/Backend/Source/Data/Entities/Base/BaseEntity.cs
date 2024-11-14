namespace Backend.Data.Entities.Base;

public abstract class BaseEntity<TId> : AuditableEntity, IBaseEntity<TId>
{
    public TId Id { get; set; } = default!;
} 
