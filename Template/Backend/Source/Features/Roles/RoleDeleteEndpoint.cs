using FluentValidation;
using Backend.Auth;
using Backend.Services.Identity;

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
        Permissions(Allow.Roles_Delete);
    }

    public override async Task HandleAsync(RoleDeleteRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _roleService.GetByIdAsync(request.Id);
        if (entity == null)
        {
            await SendNotFoundAsync();
            return;
        }
        if (entity.Default)
            ThrowError("Default role can not be deleted.");

        // Delete the entity from the db
        await _roleService.DeleteAsync(entity);
        await SendAsync(new RoleDeleteResponse { Success = true });
    }
}

sealed class RoleDeleteRequest
{
    public Guid Id { get; set; }
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
    public string Message { get; set; }
}


