using Backend.Auth;
using Backend.Data.Entities.Identity;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Roles;

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
        Permissions(Allow.Roles_View);
    }

    public override async Task HandleAsync(RoleGetRequest request, CancellationToken cancellationToken)
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

        await SendAsync(Map.FromEntity(entity));
    }
}

sealed class RoleGetRequest
{
    public Guid Id { get; set; }
}

sealed class RoleGetValidator : Validator<RoleGetRequest>
{
    public RoleGetValidator()
    {
        // Add validation rules here
    }
}

sealed class RoleGetResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public List<Guid> Permissions { get; set; } = [];
    public DateTime CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
}

sealed class RoleGetMapper : Mapper<RoleGetRequest, RoleGetResponse, Role>
{
    public override RoleGetResponse FromEntity(Role e)
    {
        return new RoleGetResponse
        {
            Id = e.Id,
            Name = e.Name,
            Description = e.Description,
            Permissions = e.RolePermissions.Select(x => x.PermissionId).ToList(),
            CreatedAt = e.CreatedAt,
            CreatedBy = e.CreatedBy,
            UpdatedAt = e.UpdatedAt,
            UpdatedBy = e.UpdatedBy,
        };
    }
}


