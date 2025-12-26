namespace Backend.Features.Identity.Endpoints.Roles;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;

sealed class RoleListEndpoint(IRoleService roleService) : Endpoint<RoleListRequest, RoleListResponse>
{
    public override void Configure()
    {
        Get("");
        Group<RolesGroup>();
        Permissions(Allow.Role_View);
    }

    public override async Task HandleAsync(RoleListRequest request, CancellationToken cancellationToken)
    {
        // get entities from db
        var query = roleService.Roles()
            .AsNoTracking()
            .Include(x => x.RolePermissions)
            .Include(x => x.UserRoles)
            .AsQueryable();

        var search = request.Search?.Trim().ToLowerInvariant();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                EF.Functions.Like(x.NameNormalized, $"%{search}%")
                || EF.Functions.Like(x.Description, $"%{search}%"));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .Process(request)
            .ToListAsync(cancellationToken);

        var dtoMapper = new RoleListDtoMapper();
        var response = new RoleListResponse
        {
            Items = items.Select(dtoMapper.Map).ToList(),
            Total = total
        };

        await Send.ResponseAsync(response, cancellation: cancellationToken);
    }
}

sealed class RoleListRequest : ListRequestDto<Guid>
{
}

sealed class RoleListValidator : Validator<RoleListRequest>
{
    public RoleListValidator()
    {
        Include(new ListRequestDtoValidator<Guid>());
    }
}

public sealed class RoleListResponse : ListDto<RoleListDto>
{
}

public sealed class RoleListDto : AuditableDto<Guid>
{
    public string Name { get; set; } = null!;
    public string NameNormalized { get; set; } = null!;
    public string? Description { get; set; }
    public List<Guid> Permissions { get; set; } = [];
    public int UserCount { get; set; }
}

sealed class RoleListMapper : Mapper<RoleListRequest, List<RoleListDto>, List<Role>>
{
    public override List<RoleListDto> FromEntity(List<Role> e)
    {
        return e.Select(entity => new RoleListDto
        {
            Id = entity.Id,
            Name = entity.Name,
            NameNormalized = entity.NameNormalized,
            Description = entity.Description,
            Permissions = entity.RolePermissions.Select(x => x.PermissionId).ToList(),
            UserCount = entity.UserRoles.Count,
            CreatedAt = entity.CreatedAt,
            CreatedBy = entity.CreatedBy,
            UpdatedAt = entity.UpdatedAt,
            UpdatedBy = entity.UpdatedBy,
        }).ToList();
    }
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class RoleListDtoMapper
{
    [MapProperty(nameof(Role.RolePermissions), nameof(RoleGetResponse.Permissions), Use = nameof(RolePermissionsToPermissions)),
     MapProperty(nameof(Role.UserRoles.Count), nameof(RoleGetResponse.UserCount))]
    public partial RoleListDto Map(Role entity);
    
    private static List<Guid> RolePermissionsToPermissions(ICollection<RolePermission> rolePermissions)
    {
        return rolePermissions.Select(x => x.PermissionId).ToList();
    }
}


