using Backend.Base.Dto;
using Backend.ErrorHandling;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Allow = Backend.Permissions.Allow;

namespace Backend.Features.Identity.Endpoints.Roles;

sealed class ChangePermissionsEndpoint : Endpoint<ChangePermissionsRequest, ChangePermissionsResponse>
{
    private readonly IRoleService _roleService;

    public ChangePermissionsEndpoint(IRoleService roleService)
    {
        _roleService = roleService;
    }

    public override void Configure()
    {
        Put("change-permissions/{id}");
        Group<RolesGroup>();
        Permissions(Allow.Role_ChangePermissions);
    }

    public override async Task HandleAsync(ChangePermissionsRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _roleService.Roles()
            .Include(x => x.RolePermissions)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity == null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }
        if (entity.Default)
            this.ThrowError("Default role permissions cannot be changed", ErrorCodes.DefaultRolePermissionsCannotBeChanged);

        // update role permissions based on request and already assigned permissions
        var permissionsToAssign = request.Permissions.Where(x => !entity.RolePermissions.Any(rp => rp.PermissionId == x)).ToList();
        foreach (var permission in permissionsToAssign)
        {
            entity.RolePermissions.Add(new RolePermission { PermissionId = permission });
        }
        var permissionsToRemove = entity.RolePermissions.Where(x => !request.Permissions.Contains(x.PermissionId)).ToList();
        foreach (var permission in permissionsToRemove)
        {
            entity.RolePermissions.Remove(permission);
        }

        // save entity to db
        await _roleService.UpdateAsync(entity);
        await SendAsync(
            new ChangePermissionsResponse
            {
                Id = entity.Id,
                Permissions = entity.RolePermissions.Select(x => x.PermissionId).ToList()
            }, cancellation: cancellationToken
        );
    }
}

sealed class ChangePermissionsRequest : BaseDto<Guid>
{
    public List<Guid> Permissions { get; set; } = [];
}

sealed class ChangePermissionsResponse : BaseDto<Guid>
{
    public List<Guid> Permissions { get; set; } = [];
}


