using Backend.Auth;
using Backend.Features.Base.Dto;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using FluentValidation;
using Allow = Backend.Permissions.Allow;

namespace Backend.Features.Identity.Endpoints.Roles;

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
        Permissions(Allow.Role_Create);
    }

    public override async Task HandleAsync(RoleCreateRequest request, CancellationToken cancellationToken)
    {
        var entity = Map.ToEntity(request);
        // save entity to db
        await _roleService.CreateAsync(entity);
        await SendAsync(Map.FromEntity(entity), cancellation: cancellationToken);
    }
}

sealed class RoleCreateRequest
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}

sealed class RoleCreateValidator : Validator<RoleCreateRequest>
{
    public RoleCreateValidator()
    {
        // Add validation rules here
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(50);
        RuleFor(x => x.Description).MinimumLength(10).MaximumLength(255).When(x => !x.Description.IsNullOrEmpty());
    }
}

sealed class RoleCreateResponse : BaseDto<Guid>
{
    public string Name { get; set; } = null!;
    public string NameNormalized { get; set; } = null!;
    public string? Description { get; set; }
}

sealed class RoleCreateMapper : Mapper<RoleCreateRequest, RoleCreateResponse, Role>
{
    public override Role ToEntity(RoleCreateRequest r)
    {
        return new Role
        {
            Name = r.Name,
            Description = r.Description,
        };
    }

    public override RoleCreateResponse FromEntity(Role e)
    {
        return new RoleCreateResponse
        {
            Id = e.Id,
            Name = e.Name,
            NameNormalized = e.NameNormalized,
            Description = e.Description,
        };
    }
}


