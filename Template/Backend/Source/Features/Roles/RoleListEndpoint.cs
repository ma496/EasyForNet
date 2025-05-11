using FluentValidation;
using Backend.Auth;
using Backend.Data.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Backend.Services.Identity;
using Backend.Features.Base.Dto;

namespace Backend.Features.Roles;

sealed class RoleListEndpoint : Endpoint<RoleListRequest, RoleListResponse, RoleListMapper>
{
    private readonly IRoleService _roleService;

    public RoleListEndpoint(IRoleService roleService)
    {
        _roleService = roleService;
    }

    public override void Configure()
    {
        Get("");
        Group<RolesGroup>();
        Permissions(Allow.Role_View);
    }

    public override async Task HandleAsync(RoleListRequest request, CancellationToken cancellationToken)
    {
        // get entities from db
        var query = _roleService.Roles()
            .AsNoTracking()
            .Include(x => x.RolePermissions)
            .Include(x => x.UserRoles)
            .AsQueryable();

        var search = request.Search?.Trim()?.ToLower();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                x.Name.ToLower().Contains(search)
                || (x.Description != null && x.Description.ToLower().Contains(search)));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .Process(request)
            .ToListAsync(cancellationToken);

        var response = new RoleListResponse
        {
            Items = Map.FromEntity(items),
            Total = total
        };

        await SendAsync(response, cancellation: cancellationToken);
    }
}

sealed class RoleListRequest : ListRequestDto
{
}

sealed class RoleListValidator : Validator<RoleListRequest>
{
    public RoleListValidator()
    {
        Include(new ListRequestDtoValidator());
    }
}

sealed class RoleListResponse : ListDto<RoleListDto>
{
}

sealed class RoleListDto : AuditableDto<Guid>
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


