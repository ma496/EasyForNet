namespace Backend.Data.Entities.Base;

public interface IBaseEntity<TId> : IAuditableEntity    
{
    TId Id { get; set; }
}
