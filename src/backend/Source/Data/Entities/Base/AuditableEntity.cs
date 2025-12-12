namespace Backend.Data.Entities.Base;

public abstract class AuditableEntity<TId> : AuditableEntity, IBaseEntity<TId>
{
    public TId Id { get; set; } = default!;
}

public abstract class AuditableEntity : IAuditableEntity, IBaseEntity
{
    public DateTime CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
}

public abstract class CreatableEntity<TId> : CreatableEntity, IBaseEntity<TId>
{
    public TId Id { get; set; } = default!;
}

public abstract class CreatableEntity : ICreatableEntity, IBaseEntity
{
    public DateTime CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
}

public abstract class UpdatableEntity<TId> : UpdatableEntity, IBaseEntity<TId>
{
    public TId Id { get; set; } = default!;
}

public abstract class UpdatableEntity : IUpdatableEntity, IBaseEntity
{
    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
}