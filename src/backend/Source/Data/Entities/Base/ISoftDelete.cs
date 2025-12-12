namespace Backend.Data.Entities.Base;

public interface ISoftDelete
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
}
