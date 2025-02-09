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
        if (Project.Endpoints == null)
            throw new UserFriendlyException($"{nameof(Project)}.{nameof(Project.Endpoints)} can not be null.");
        if (Project.Endpoints.ListEndpoint == null)
            throw new UserFriendlyException($"{nameof(Project)}.{nameof(Project.Endpoints)}.{nameof(Project.Endpoints.ListEndpoint)} can not be null.");
        if (string.IsNullOrWhiteSpace(Project.Endpoints.ListEndpoint.RequestBaseType))
            throw new UserFriendlyException($"{nameof(Project)}.{nameof(Project.Endpoints)}.{nameof(Project.Endpoints.ListEndpoint)}.{nameof(Project.Endpoints.ListEndpoint.RequestBaseType)} can not be empty.");
        if (string.IsNullOrWhiteSpace(Project.Endpoints.ListEndpoint.ResponseBaseType))
            throw new UserFriendlyException($"{nameof(Project)}.{nameof(Project.Endpoints)}.{nameof(Project.Endpoints.ListEndpoint)}.{nameof(Project.Endpoints.ListEndpoint.ResponseBaseType)} can not be empty.");
        if (string.IsNullOrWhiteSpace(Project.Endpoints.ListEndpoint.ProcessMethod))
            throw new UserFriendlyException($"{nameof(Project)}.{nameof(Project.Endpoints)}.{nameof(Project.Endpoints.ListEndpoint)}.{nameof(Project.Endpoints.ListEndpoint.ProcessMethod)} can not be empty.");
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
    public string PermissionDefinitionProviderPath { get; set; } = null!;
    public List<DtoMapping> DtoMappings { get; set; } = null!;
    public Endpoints Endpoints { get; set; } = null!;
}

public class DtoMapping
{
    public string Entity { get; set; } = null!;
    public string Dto { get; set; } = null!;
}

public class Endpoints
{
    public ListEndpoint ListEndpoint { get; set; } = null!;
}

public class ListEndpoint
{
    public string RequestBaseType { get; set; } = null!;
    public string ResponseBaseType { get; set; } = null!;
    public string ProcessMethod { get; set; } = null!;
}
