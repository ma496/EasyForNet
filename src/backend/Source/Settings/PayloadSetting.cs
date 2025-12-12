namespace Backend.Settings;

public class PayloadSetting
{
    // maximum file size in bytes
    public long MaximumSize { get; set; } = 25 * 1024 * 1024; // 25 MB
}