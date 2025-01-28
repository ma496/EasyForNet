using Backend.Features.Base.Dto;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Permissions;

sealed class GetPermissionsEndpoint : EndpointWithoutRequest<GetPermissionsResponse>
{
    private readonly IPermissionService _permissionService;

    public GetPermissionsEndpoint(IPermissionService permissionService)
    {
        _permissionService = permissionService;
    }

    public override void Configure()
    {
        Get("get");
        Group<PermissionsGroup>();
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var permissions = await _permissionService
            .Permissions()
            .Select(p => new PermissionDto
            {
                Id = p.Id,
                Name = p.Name,
                DisplayName = p.DisplayName
            })
            .ToListAsync();

        await SendAsync(new GetPermissionsResponse
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


