namespace Backend.Features.Base.Dto;

public interface IAuditableDto : ICreatableDto, IUpdatableDto
{
}

public interface ICreatableDto
{
    DateTime CreatedAt { get; set; }
    Guid? CreatedBy { get; set; }
}

public interface IUpdatableDto
{
    DateTime? UpdatedAt { get; set; }
    Guid? UpdatedBy { get; set; }
}