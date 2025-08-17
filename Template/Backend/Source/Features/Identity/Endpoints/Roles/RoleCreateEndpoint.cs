using Backend.Base.Dto;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using FluentValidation;
using Backend.Permissions;
using Riok.Mapperly.Abstractions;

namespace Backend.Features.Identity.Endpoints.Roles;

sealed class RoleCreateEndpoint(IRoleService roleService)
    : Endpoint<RoleCreateRequest, RoleCreateResponse>
{
    public override void Configure()
    {
        Post("");
        Group<RolesGroup>();
        Permissions(Allow.Role_Create);
    }

    public override async Task HandleAsync(RoleCreateRequest request, CancellationToken cancellationToken)
    {
        var requestMapper = new RoleCreateRequestMapper();
        var entity = requestMapper.Map(request);
        // save entity to db
        await roleService.CreateAsync(entity);
        var responseMapper = new RoleCreateResponseMapper();
        await SendAsync(responseMapper.Map(entity), cancellation: cancellationToken);
    }
}

public sealed class RoleCreateRequest
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

public sealed class RoleCreateResponse : BaseDto<Guid>
{
    public string Name { get; set; } = null!;
    public string NameNormalized { get; set; } = null!;
    public string? Description { get; set; }
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Source)]
public partial class RoleCreateRequestMapper
{
    public partial Role Map(RoleCreateRequest request);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class RoleCreateResponseMapper
{
    public partial RoleCreateResponse Map(Role entity);
}


