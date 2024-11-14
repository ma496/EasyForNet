using Backend.Data.Entities.Base;

namespace Backend.Data.Entities.Identity;

public class User : BaseEntity<Guid>, IExcludeProperties
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
    
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    public static List<string> ExcludeProperties()
    {
        return new List<string> 
        { 
            nameof(PasswordHash),
            nameof(LastLoginAt) 
        };
    }
}