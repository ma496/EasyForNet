using Backend.Auth;
using Backend.ErrorHandling;
using Backend.Features.Base.Dto;
using Backend.Features.Identity.Core;
using FluentValidation;
using Allow = Backend.Permissions.Allow;

namespace Backend.Features.Identity.Endpoints.Roles;

sealed class RoleDeleteEndpoint : Endpoint<RoleDeleteRequest, RoleDeleteResponse>
{
    private readonly IRoleService _roleService;

    public RoleDeleteEndpoint(IRoleService roleService)
    {
        _roleService = roleService;
    }

    public override void Configure()
    {
        Delete("{id}");
        Group<RolesGroup>();
        Permissions(Allow.Role_Delete);
    }

    public override async Task HandleAsync(RoleDeleteRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _roleService.GetByIdAsync(request.Id);
        if (entity == null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }
        if (entity.Default)
            this.ThrowError("Default role cannot be deleted", ErrorCodes.DefaultRoleCannotBeDeleted);

        // Delete the entity from the db
        await _roleService.DeleteAsync(entity);
        await SendAsync(new RoleDeleteResponse { Success = true }, cancellation: cancellationToken);
    }
}

sealed class RoleDeleteRequest : BaseDto<Guid>
{
}

sealed class RoleDeleteValidator : Validator<RoleDeleteRequest>
{
    public RoleDeleteValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

sealed class RoleDeleteResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
}


