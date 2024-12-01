namespace Backend.Data.Entities.Base;

public interface IAuditableEntity : ICreatableEntity, IUpdatableEntity
{
}

public interface ICreatableEntity
{
    DateTime CreatedAt { get; set; }
    Guid? CreatedBy { get; set; }
}

public interface IUpdatableEntity
{
    DateTime? UpdatedAt { get; set; }
    Guid? UpdatedBy { get; set; }
}