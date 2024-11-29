namespace FastEndpointsTool;

public class FeToolSetting
{
    public ProjectSetting Project { get; set; } = null!;

    public void Validate()
    {
        if (Project == null)
            throw new UserFriendlyException($"{nameof(Project)} can not be null.");
        if (Project.Directory == null)
            throw new UserFriendlyException($"{nameof(Project)}.{nameof(Project.Directory)} can not be null.");
        if (string.IsNullOrWhiteSpace(Project.Name))
            throw new UserFriendlyException($"{nameof(Project)}.{nameof(Project.Name)} can not be empty.");
        if (string.IsNullOrWhiteSpace(Project.EndpointPath))
            throw new UserFriendlyException($"{nameof(Project)}.{nameof(Project.EndpointPath)} can not be empty.");
        if (string.IsNullOrWhiteSpace(Project.RootNamespace))
            throw new UserFriendlyException($"{nameof(Project)}.{nameof(Project.RootNamespace)} can not be empty.");
        if (string.IsNullOrWhiteSpace(Project.PermissionsNamespace))
            throw new UserFriendlyException($"{nameof(Project)}.{nameof(Project.PermissionsNamespace)} can not be empty.");
        if (string.IsNullOrWhiteSpace(Project.SortingColumn))
            throw new UserFriendlyException($"{nameof(Project)}.{nameof(Project.SortingColumn)} can not be empty.");
        if (string.IsNullOrWhiteSpace(Project.AllowClassPath))
            throw new UserFriendlyException($"{nameof(Project)}.{nameof(Project.AllowClassPath)} can not be empty.");
    }
}

public class ProjectSetting
{
    public string Directory { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string EndpointPath { get; set; } = null!;
    public string RootNamespace { get; set; } = null!;
    public string PermissionsNamespace { get; set; } = null!;
    public string SortingColumn { get; set; } = null!;
    public string AllowClassPath { get; set; } = null!;
}
