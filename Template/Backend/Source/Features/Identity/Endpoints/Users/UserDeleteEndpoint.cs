using Backend.Base.Dto;
using Backend.ErrorHandling;
using Backend.Features.Identity.Core;
using FluentValidation;
using Backend.Permissions;

namespace Backend.Features.Identity.Endpoints.Users;

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
            await SendNotFoundAsync(cancellationToken);
            return;
        }
        if (entity.Default)
            this.ThrowError("Default user cannot be deleted", ErrorCodes.DefaultUserCannotBeDeleted);

        // Delete the entity from the db
        await userService.DeleteAsync(request.Id);
        await SendAsync(new() { Success = true }, cancellation: cancellationToken);
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


