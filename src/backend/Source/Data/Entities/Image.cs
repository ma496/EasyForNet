namespace Backend.Data.Entities;

using Backend.Data.Entities.Base;

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
