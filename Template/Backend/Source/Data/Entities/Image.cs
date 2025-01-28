using Backend.Data.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.Entities;

[Owned]
public class Image : ValueObject
{
    public byte[] Data { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public string ContentType { get; set; } = null!;

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Data;
        yield return FileName;
        yield return ContentType;
    }
}
