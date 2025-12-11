namespace Backend.Features.Identity.Endpoints.Users;

using Backend.Features.Identity.Core;

sealed class UserDeleteEndpoint(IUserService userService) : Endpoint<UserDeleteRequest, UserDeleteResponse>
{
    public override void Configure()
    {
        Delete("{id}");
        Group<UsersGroup>();
        Permissions(Allow.User_Delete);
    }

    public override async Task HandleAsync(UserDeleteRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await userService.GetByIdAsync(request.Id);
        if (entity == null)
        {
            await Send.NotFoundAsync(cancellationToken);
            return;
        }
        if (entity.Default)
            ThrowError("Default user cannot be deleted", ErrorCodes.DefaultUserCannotBeDeleted);

        // Delete the entity from the db
        await userService.DeleteAsync(request.Id);
        await Send.ResponseAsync(new() { Success = true }, cancellation: cancellationToken);
    }
}

sealed class UserDeleteRequest : BaseDto<Guid>
{
}

sealed class UserDeleteValidator : Validator<UserDeleteRequest>
{
    public UserDeleteValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

sealed class UserDeleteResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
}


