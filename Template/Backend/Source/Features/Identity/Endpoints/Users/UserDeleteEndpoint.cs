using Backend.Base.Dto;
using Backend.ErrorHandling;
using Backend.Features.Identity.Core;
using FluentValidation;
using Allow = Backend.Permissions.Allow;

namespace Backend.Features.Identity.Endpoints.Users;

sealed class UserDeleteEndpoint : Endpoint<UserDeleteRequest, UserDeleteResponse>
{
    private readonly IUserService _userService;

    public UserDeleteEndpoint(IUserService userService)
    {
        _userService = userService;
    }

    public override void Configure()
    {
        Delete("{id}");
        Group<UsersGroup>();
        Permissions(Allow.User_Delete);
    }

    public override async Task HandleAsync(UserDeleteRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _userService.GetByIdAsync(request.Id);
        if (entity == null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }
        if (entity.Default)
            this.ThrowError("Default user cannot be deleted", ErrorCodes.DefaultUserCannotBeDeleted);

        // Delete the entity from the db
        await _userService.DeleteAsync(request.Id);
        await SendAsync(new UserDeleteResponse { Success = true }, cancellation: cancellationToken);
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


