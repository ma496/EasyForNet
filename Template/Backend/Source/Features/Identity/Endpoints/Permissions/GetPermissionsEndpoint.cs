namespace Backend.Features.Identity.Endpoints.Permissions;

using Backend.Features.Identity.Core;

sealed class GetPermissionsEndpoint(IPermissionService permissionService) : EndpointWithoutRequest<GetPermissionsResponse>
{
    public override void Configure()
    {
        Get("get");
        Group<PermissionsGroup>();
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var permissions = await permissionService
            .Permissions()
            .Select(p => new PermissionDto
            {
                Id = p.Id,
                Name = p.Name,
                DisplayName = p.DisplayName
            })
            .ToListAsync(cancellationToken);

        await Send.ResponseAsync(new()
        {
            Permissions = permissions
        }, cancellation: cancellationToken);
    }
}

sealed class GetPermissionsResponse
{
    public IReadOnlyList<PermissionDto> Permissions { get; set; } = [];
}

sealed class PermissionDto : BaseDto<Guid>
{
    public string Name { get; set; } = null!;
    public string DisplayName { get; set; } = null!;
}


