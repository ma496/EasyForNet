namespace Backend.Features.Identity.Endpoints.Permissions;

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

sealed class GetDefinePermissionsResponse
{
    public IReadOnlyList<PermissionGroupDefinition> Groups { get; set; } = [];
}


