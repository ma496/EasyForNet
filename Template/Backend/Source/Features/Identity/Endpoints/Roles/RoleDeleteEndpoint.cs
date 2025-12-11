namespace Backend.Features.Identity.Endpoints.Roles;

using Backend.Features.Identity.Core;

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
            await Send.NotFoundAsync(cancellationToken);
            return;
        }
        if (entity.Default)
            ThrowError("Default role cannot be deleted", ErrorCodes.DefaultRoleCannotBeDeleted);

        // Delete the entity from the db
        await roleService.DeleteAsync(entity);
        await Send.ResponseAsync(new() { Success = true }, cancellation: cancellationToken);
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


