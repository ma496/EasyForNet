using FluentValidation;
using Backend.Auth;
using Backend.Data.Entities.Identity;
using Backend.Services.Identity;

namespace Backend.Features.Roles;

sealed class RoleCreateEndpoint : Endpoint<RoleCreateRequest, RoleCreateResponse, RoleCreateMapper>
{
    private readonly IRoleService _roleService;

    public RoleCreateEndpoint(IRoleService roleService)
    {
        _roleService = roleService;
    }

    public override void Configure()
    {
        Post("");
        Group<RolesGroup>();
        Permissions(Allow.Roles_Create);
    }

    public override async Task HandleAsync(RoleCreateRequest request, CancellationToken cancellationToken)
    {
        var entity = Map.ToEntity(request);
        // save entity to db
        await _roleService.CreateAsync(entity);
        await SendAsync(Map.FromEntity(entity));
    }
}

sealed class RoleCreateRequest
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public List<Guid> Permissions { get; set; } = [];
}

sealed class RoleCreateValidator : Validator<RoleCreateRequest>
{
    public RoleCreateValidator()
    {
        // Add validation rules here
        RuleFor(x => x.Name).NotEmpty().MinimumLength(3).MaximumLength(50);
        RuleFor(x => x.Description).MinimumLength(10).MaximumLength(255);
    }
}

sealed class RoleCreateResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public List<Guid> Permissions { get; set; } = [];
}

sealed class RoleCreateMapper : Mapper<RoleCreateRequest, RoleCreateResponse, Role>
{
    public override Role ToEntity(RoleCreateRequest r)
    {
        return new Role
        {
            Name = r.Name,
            Description = r.Description,
            RolePermissions = r.Permissions.Select(x => new RolePermission { PermissionId = x }).ToList()
        };
    }

    public override RoleCreateResponse FromEntity(Role e)
    {
        return new RoleCreateResponse
        {
            Id = e.Id,
            Name = e.Name,
            Description = e.Description,
            Permissions = e.RolePermissions.Select(x => x.PermissionId).ToList()
        };
    }
}


