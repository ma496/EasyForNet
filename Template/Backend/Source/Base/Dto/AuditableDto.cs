namespace Backend.Base.Dto;

public abstract class AuditableDto<TId> : AuditableDto, IBaseDto<TId>
{
    public TId Id { get; set; } = default!;
}

public abstract class AuditableDto : IAuditableDto
{
    public DateTime CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
}

public abstract class CreatableDto<TId> : CreatableDto, IBaseDto<TId>
{
    public TId Id { get; set; } = default!;
}

public abstract class CreatableDto : ICreatableDto
{
    public DateTime CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
}

public abstract class UpdatableDto<TId> : UpdatableDto, IBaseDto<TId>
{
    public TId Id { get; set; } = default!;
}

public abstract class UpdatableDto : IUpdatableDto
{
    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
}