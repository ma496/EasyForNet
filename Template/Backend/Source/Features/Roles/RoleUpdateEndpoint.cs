using FluentValidation;
using Backend.Auth;
using Backend.Data.Entities.Identity;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Roles;

sealed class RoleUpdateEndpoint : Endpoint<RoleUpdateRequest, RoleUpdateResponse, RoleUpdateMapper>
{
    private readonly IRoleService _roleService;

    public RoleUpdateEndpoint(IRoleService roleService)
    {
        _roleService = roleService;
    }

    public override void Configure()
    {
        Put("{id}");
        Group<RolesGroup>();
        Permissions(Allow.Roles_Update);
    }

    public override async Task HandleAsync(RoleUpdateRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _roleService.Roles()
            .Include(x => x.RolePermissions)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity == null)
        {
            await SendNotFoundAsync();
            return;
        }
        if (entity.Default)
            ThrowError("Default role can not be updated.");

        Map.UpdateEntity(request, entity);
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
        await SendAsync(Map.FromEntity(entity));
    }
}

sealed class RoleUpdateRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public List<Guid> Permissions { get; set; } = [];
}

sealed class RoleUpdateValidator : Validator<RoleUpdateRequest>
{
    public RoleUpdateValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Description).MaximumLength(1024);
    }
}

sealed class RoleUpdateResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public List<Guid> Permissions { get; set; } = [];
}

sealed class RoleUpdateMapper : Mapper<RoleUpdateRequest, RoleUpdateResponse, Role>
{
    public override Role UpdateEntity(RoleUpdateRequest r, Role e)
    {
        e.Name = r.Name;
        e.Description = r.Description;

        return e;
    }

    public override RoleUpdateResponse FromEntity(Role e)
    {
        return new RoleUpdateResponse
        {
            Id = e.Id,
            Name = e.Name,
            Description = e.Description,
            Permissions = e.RolePermissions.Select(x => x.PermissionId).ToList()
        };
    }
}


