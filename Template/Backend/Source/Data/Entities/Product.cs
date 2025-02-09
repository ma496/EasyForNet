using Backend.Data.Entities.Base;

namespace Backend.Data.Entities;

public class Product : AuditableEntity<Guid>
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string ImageUrl { get; set; }
    public bool IsActive { get; set; }
    
}

