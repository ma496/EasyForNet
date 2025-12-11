namespace Backend.Features.Identity.Endpoints.Roles;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;

sealed class RoleUpdateEndpoint(IRoleService roleService)
    : Endpoint<RoleUpdateRequest, RoleUpdateResponse>
{
    public override void Configure()
    {
        Put("{id}");
        Group<RolesGroup>();
        Permissions(Allow.Role_Update);
    }

    public override async Task HandleAsync(RoleUpdateRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await roleService.Roles()
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity == null)
        {
            await Send.NotFoundAsync(cancellationToken);
            return;
        }
        if (entity.Default)
            ThrowError("Default role cannot be updated", ErrorCodes.DefaultRoleCannotBeUpdated);

        var requestMapper = new RoleUpdateRequestMapper();
        requestMapper.Update(request, entity);

        // save entity to db
        await roleService.UpdateAsync(entity);
        var responseMapper = new RoleUpdateResponseMapper();
        await Send.ResponseAsync(responseMapper.Map(entity), cancellation: cancellationToken);
    }
}

public sealed class RoleUpdateRequest : BaseDto<Guid>
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}

sealed class RoleUpdateValidator : Validator<RoleUpdateRequest>
{
    public RoleUpdateValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(50);
        RuleFor(x => x.Description).MinimumLength(10).MaximumLength(255).When(x => !string.IsNullOrEmpty(x.Description));
    }
}

public sealed class RoleUpdateResponse : BaseDto<Guid>
{
    public string Name { get; set; } = null!;
    public string NameNormalized { get; set; } = null!;
    public string? Description { get; set; }
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
            NameNormalized = e.NameNormalized,
            Description = e.Description,
        };
    }
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Source)]
public partial class RoleUpdateRequestMapper
{
    public partial void Update(RoleUpdateRequest request, Role entity);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class RoleUpdateResponseMapper
{
    public partial RoleUpdateResponse Map(Role entity);
}


