using Backend.Base.Dto;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Allow = Backend.Permissions.Allow;

namespace Backend.Features.Identity.Endpoints.Roles;

sealed class RoleGetEndpoint : Endpoint<RoleGetRequest, RoleGetResponse, RoleGetMapper>
{
    private readonly IRoleService _roleService;

    public RoleGetEndpoint(IRoleService roleService)
    {
        _roleService = roleService;
    }

    public override void Configure()
    {
        Get("{id}");
        Group<RolesGroup>();
        Permissions(Allow.Role_View);
    }

    public override async Task HandleAsync(RoleGetRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _roleService.Roles()
            .Include(x => x.RolePermissions)
            .Include(x => x.UserRoles)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity == null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }

        await SendAsync(Map.FromEntity(entity), cancellation: cancellationToken);
    }
}

sealed class RoleGetRequest : BaseDto<Guid>
{
}

sealed class RoleGetValidator : Validator<RoleGetRequest>
{
    public RoleGetValidator()
    {
        // Add validation rules here
    }
}

sealed class RoleGetResponse : AuditableDto<Guid>
{
    public string Name { get; set; } = null!;
    public string NameNormalized { get; set; } = null!;
    public string? Description { get; set; }
    public List<Guid> Permissions { get; set; } = [];
    public int UserCount { get; set; }
}

sealed class RoleGetMapper : Mapper<RoleGetRequest, RoleGetResponse, Role>
{
    public override RoleGetResponse FromEntity(Role e)
    {
        return new RoleGetResponse
        {
            Id = e.Id,
            Name = e.Name,
            NameNormalized = e.NameNormalized,
            Description = e.Description,
            Permissions = e.RolePermissions.Select(x => x.PermissionId).ToList(),
            UserCount = e.UserRoles.Count,
            CreatedAt = e.CreatedAt,
            CreatedBy = e.CreatedBy,
            UpdatedAt = e.UpdatedAt,
            UpdatedBy = e.UpdatedBy,
        };
    }
}


