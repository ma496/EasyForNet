namespace Backend.Features.Identity.Endpoints.Permissions;

/// <summary>
/// GET endpoint that returns the static set of permission groups defined in code via
/// the permission-definition service (used to drive role/permission editors).
/// </summary>
sealed class GetDefinePermissionsEndpoint(IPermissionDefinitionService permissionDefinitionService) : EndpointWithoutRequest<GetDefinePermissionsResponse>
{
    public override void Configure()
    {
        Get("define");
        Group<PermissionsGroup>();
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var groups = permissionDefinitionService.GetPermissionGroups();

        await Send.ResponseAsync(new()
        {
            Groups = groups
        }, cancellation: cancellationToken);
    }
}

/// <summary>
/// Response payload for the "define" permissions endpoint, containing the static
/// permission groups registered with the application.
/// </summary>
sealed class GetDefinePermissionsResponse
{
    public IReadOnlyList<PermissionGroupDefinition> Groups { get; set; } = [];
}


