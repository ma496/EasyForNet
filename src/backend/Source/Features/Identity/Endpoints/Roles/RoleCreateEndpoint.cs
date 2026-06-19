namespace Backend.Features.Identity.Endpoints.Roles;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;

/// <summary>
/// This endpoint that handles <c>POST /roles</c> to create a new role with a unique name.
/// </summary>
sealed class RoleCreateEndpoint(IRoleService roleService, AppDbContext dbContext)
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
        var nameExists = await dbContext.Roles
            .AnyAsync(x => x.NameNormalized == request.Name.Trim().ToLowerInvariant(), cancellationToken);
        if (nameExists)
        {
            ThrowError("Role name already exists", ErrorCodes.RoleNameAlreadyExists);
        }

        var requestMapper = new RoleCreateRequestMapper();
        var entity = requestMapper.Map(request);
        // save entity to db
        await roleService.CreateAsync(entity);
        var responseMapper = new RoleCreateResponseMapper();
        await Send.ResponseAsync(responseMapper.Map(entity), cancellation: cancellationToken);
    }
}

/// <summary>
/// Request payload for creating a new role, supplying a name and optional description.
/// </summary>
public sealed class RoleCreateRequest
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}

/// <summary>
/// FluentValidation rules requiring a non-empty, length-bounded name and a length-bounded optional description.
/// </summary>
sealed class RoleCreateValidator : Validator<RoleCreateRequest>
{
    public RoleCreateValidator()
    {
        // Add validation rules here
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(50);
        RuleFor(x => x.Description).MinimumLength(10).MaximumLength(255).When(x => !x.Description.IsNullOrEmpty());
    }
}

/// <summary>
/// Response payload returned after a successful role creation, echoing the assigned identifiers and metadata.
/// </summary>
public sealed class RoleCreateResponse : BaseDto<Guid>
{
    public string Name { get; set; } = null!;
    public string NameNormalized { get; set; } = null!;
    public string? Description { get; set; }
}

/// <summary>
/// This mapper that projects a <see cref="RoleCreateRequest"/> into a <see cref="Role"/> entity.
/// </summary>
[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Source)]
public partial class RoleCreateRequestMapper
{
    public partial Role Map(RoleCreateRequest request);
}

/// <summary>
/// This mapper that projects a <see cref="Role"/> entity into a <see cref="RoleCreateResponse"/>.
/// </summary>
[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class RoleCreateResponseMapper
{
    public partial RoleCreateResponse Map(Role entity);
}


