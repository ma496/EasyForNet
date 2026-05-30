namespace Backend.Settings;

public class WebSetting
{
    public string DefaultDomain { get; set; } = null!;
    public string[] Domains { get; set; } = [];

    // Combine DefaultDomain and Domains to get the full list of unique allowed domains
    public string[] AllowedDomains()
    {
        var returnDomains = new List<string> { DefaultDomain };
        returnDomains.AddRange(Domains);
        return returnDomains.Distinct().ToArray();
    }
}