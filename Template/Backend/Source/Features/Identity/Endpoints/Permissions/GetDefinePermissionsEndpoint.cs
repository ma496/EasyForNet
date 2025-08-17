using Backend.Permissions;

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
        var permissions = permissionDefinitionService.GetPermissions();

        await SendAsync(new GetDefinePermissionsResponse
        {
            Permissions = permissions
        }, cancellation: cancellationToken);
    }
}

sealed class GetDefinePermissionsResponse
{
    public IReadOnlyList<PermissionDefinition> Permissions { get; set; } = [];
}


