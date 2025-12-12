namespace Backend.Features.Identity.Endpoints.Roles;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;

sealed class RoleGetEndpoint(IRoleService roleService) : Endpoint<RoleGetRequest, RoleGetResponse>
{
    public override void Configure()
    {
        Get("{id}");
        Group<RolesGroup>();
        Permissions(Allow.Role_View);
    }

    public override async Task HandleAsync(RoleGetRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await roleService.Roles()
            .Include(x => x.RolePermissions)
            .Include(x => x.UserRoles)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity == null)
        {
            await Send.NotFoundAsync(cancellationToken);
            return;
        }

        var responseMapper = new RoleGetResponseMapper();
        await Send.ResponseAsync(responseMapper.Map(entity), cancellation: cancellationToken);
    }
}

sealed class RoleGetRequest : BaseDto<Guid>
{
}

sealed class RoleGetValidator : Validator<RoleGetRequest>
{ }

public sealed class RoleGetResponse : AuditableDto<Guid>
{
    public string Name { get; set; } = null!;
    public string NameNormalized { get; set; } = null!;
    public string? Description { get; set; }
    public List<Guid> Permissions { get; set; } = [];
    public int UserCount { get; set; }
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class RoleGetResponseMapper
{
    [MapProperty(nameof(Role.RolePermissions), nameof(RoleGetResponse.Permissions), Use = nameof(RolePermissionsToPermissions)),
     MapProperty(nameof(Role.UserRoles.Count), nameof(RoleGetResponse.UserCount))]
    public partial RoleGetResponse Map(Role entity);

    private static List<Guid> RolePermissionsToPermissions(ICollection<RolePermission> rolePermissions)
    {
        return rolePermissions.Select(x => x.PermissionId).ToList();
    }
}


