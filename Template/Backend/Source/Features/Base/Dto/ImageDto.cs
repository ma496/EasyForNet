namespace Backend.Features.Base.Dto;

public class ImageDto
{
    public string ImageBase64 { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public string ContentType { get; set; } = null!;
}
