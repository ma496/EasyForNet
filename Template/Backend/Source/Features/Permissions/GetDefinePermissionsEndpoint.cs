using Backend.Auth;

namespace Backend.Features.Permissions;

sealed class GetDefinePermissionsEndpoint : EndpointWithoutRequest<GetDefinePermissionsResponse>
{
    private readonly IPermissionDefinitionService _permissionDefinitionService;

    public GetDefinePermissionsEndpoint(IPermissionDefinitionService permissionDefinitionService)
    {
        _permissionDefinitionService = permissionDefinitionService;
    }

    public override void Configure()
    {
        Get("define");
        Group<PermissionsGroup>();
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var permissions = _permissionDefinitionService.GetPermissions();

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


