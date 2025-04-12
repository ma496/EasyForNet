using FluentValidation;
using Backend.Auth;
using Backend.Services.Identity;
using Backend.Features.Base.Dto;

namespace Backend.Features.Roles;

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
            ThrowError("default_role_cannot_be_deleted");

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


