namespace Backend.Features;

public class MetadataEndpoint : Endpoint<MetadataRequest, MetadataResponse>
{
    public override void Configure()
    {
        Get("metadata");
        AllowAnonymous();
    }

    public override Task HandleAsync(MetadataRequest req, CancellationToken ct)
    {
        var dataSource = Resolve<EndpointDataSource>();

        var allEndpoints = dataSource.Endpoints
            .OfType<RouteEndpoint>()
            .Where(e => e.Metadata.GetMetadata<EndpointDefinition>() != null)
            .Where(e =>
            {
                var def = e.Metadata.GetMetadata<EndpointDefinition>()!;
                var route = def.Routes?.FirstOrDefault() ?? e.RoutePattern.RawText;
                var groupName = route != null && route.Contains('/') ? route.Split('/', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() : null;
                return string.Equals(groupName, req.Group, StringComparison.OrdinalIgnoreCase);
            });

        // If a group is specified in the request, filter the endpoints first
        // if (!string.IsNullOrEmpty(req.Group))
        // {
        //     allEndpoints = allEndpoints.Where(e =>
        //     {
        //         var def = e.Metadata.GetMetadata<EndpointDefinition>()!;
        //         var route = def.Routes?.FirstOrDefault() ?? e.RoutePattern.RawText ?? string.Empty;
        //         var groupName = route.Split('/', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault();
        //         return string.Equals(groupName, req.Group, StringComparison.OrdinalIgnoreCase);
        //     });
        // }

        var endpoints = allEndpoints.Select(e =>
            {
                var def = e.Metadata.GetMetadata<EndpointDefinition>()!;
                var route = def.Routes?.FirstOrDefault() ?? e.RoutePattern.RawText;
                var baseName = def.EndpointType.Name.Replace("Endpoint", "");

                return new EndpointMetadata
                {
                    Name = baseName,
                    Group = route != null && route.Contains('/') ? route.Split('/', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() : null,
                    Route = route,
                    HttpVerb = def.Verbs?.FirstOrDefault(),
                    Summary = def.EndpointSummary?.Summary,
                    RequestType = def.ReqDtoType?.FullName,
                    ResponseType = def.ResDtoType?.FullName
                };
            })
            .ToList();

        // throw exception if same endpoint name exists in the same group
        var groupedEndpoints = endpoints.GroupBy(e => e.Group);

        foreach (var group in groupedEndpoints)
        {
            var duplicateNames = group
                .GroupBy(e => e.Name)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key);

            if (duplicateNames.Any())
            {
                throw new Exception($"Duplicate endpoint names found in group '{group.Key}': {string.Join(", ", duplicateNames)}");
            }
        }

        var response = new MetadataResponse { Endpoints = endpoints };
        return SendAsync(response, cancellation: ct);
    }
}

public class MetadataRequest
{
    public string? Group { get; set; }
}

public class MetadataResponse
{
    public List<EndpointMetadata> Endpoints { get; set; } = null!;
}

public class EndpointMetadata
{
    public string Name { get; set; } = null!;
    public string? Group { get; set; }
    public string? Route { get; set; }
    public string? HttpVerb { get; set; }
    public string? Summary { get; set; }
    public string? RequestType { get; set; }
    public string? ResponseType { get; set; }
}