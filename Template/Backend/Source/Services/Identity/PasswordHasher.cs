using System.Security.Cryptography;
using System.Text;

namespace Backend.Services.Identity;

public interface IPasswordHasher
{
    string HashPassword(string password);
}

public class PasswordHasher : IPasswordHasher
{
    public string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}