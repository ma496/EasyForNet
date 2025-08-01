using Backend.Base.Dto;
using Backend.ErrorHandling;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Allow = Backend.Permissions.Allow;

namespace Backend.Features.Identity.Endpoints.Roles;

sealed class RoleUpdateEndpoint : Endpoint<RoleUpdateRequest, RoleUpdateResponse, RoleUpdateMapper>
{
    private readonly IRoleService _roleService;

    public RoleUpdateEndpoint(IRoleService roleService)
    {
        _roleService = roleService;
    }

    public override void Configure()
    {
        Put("{id}");
        Group<RolesGroup>();
        Permissions(Allow.Role_Update);
    }

    public override async Task HandleAsync(RoleUpdateRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _roleService.Roles()
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity == null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }
        if (entity.Default)
            this.ThrowError("Default role cannot be updated", ErrorCodes.DefaultRoleCannotBeUpdated);

        Map.UpdateEntity(request, entity);

        // save entity to db
        await _roleService.UpdateAsync(entity);
        await SendAsync(Map.FromEntity(entity), cancellation: cancellationToken);
    }
}

sealed class RoleUpdateRequest : BaseDto<Guid>
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

sealed class RoleUpdateResponse : BaseDto<Guid>
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


