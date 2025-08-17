using Backend.Base.Dto;
using Backend.ErrorHandling;
using Backend.Features.Identity.Core;
using FluentValidation;
using Backend.Permissions;

namespace Backend.Features.Identity.Endpoints.Roles;

sealed class RoleDeleteEndpoint(IRoleService roleService) : Endpoint<RoleDeleteRequest, RoleDeleteResponse>
{
    public override void Configure()
    {
        Delete("{id}");
        Group<RolesGroup>();
        Permissions(Allow.Role_Delete);
    }

    public override async Task HandleAsync(RoleDeleteRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await roleService.GetByIdAsync(request.Id);
        if (entity == null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }
        if (entity.Default)
            this.ThrowError("Default role cannot be deleted", ErrorCodes.DefaultRoleCannotBeDeleted);

        // Delete the entity from the db
        await roleService.DeleteAsync(entity);
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


