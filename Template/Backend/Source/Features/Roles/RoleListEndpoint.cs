using FluentValidation;
using Backend.Auth;
using Backend.Data.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Backend.Services.Identity;

namespace Backend.Features.Roles;

sealed class RoleListEndpoint : Endpoint<RoleListRequest, List<RoleListResponse>, RoleListMapper>
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
        Permissions(Allow.Roles_View);
    }

    public override async Task HandleAsync(RoleListRequest request, CancellationToken cancellationToken)
    {
        // get entities from db
        var entities = await _roleService.Roles()
            .AsNoTracking()
            .Include(x => x.RolePermissions)
            .OrderByDescending(x => x.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);
        await SendAsync(Map.FromEntity(entities));
    }
}

sealed class RoleListRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    // Add any additional filter properties here
}

sealed class RoleListValidator : Validator<RoleListRequest>
{
    public RoleListValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
        // Add additional validation rules here
    }
}

sealed class RoleListResponse
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

sealed class RoleListMapper : Mapper<RoleListRequest, List<RoleListResponse>, List<Role>>
{
    public override List<RoleListResponse> FromEntity(List<Role> e)
    {
        return e.Select(entity => new RoleListResponse
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Permissions = entity.RolePermissions.Select(x => x.PermissionId).ToList(),
            CreatedAt = entity.CreatedAt,
            CreatedBy = entity.CreatedBy,
            UpdatedAt = entity.UpdatedAt,
            UpdatedBy = entity.UpdatedBy,
        }).ToList();
    }
}


