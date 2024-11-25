using FluentValidation;
using Backend.Services.Identity;
using Backend.Auth;

namespace Backend.Features.Users;

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
        Permissions(Allow.Users_Delete);
    }

    public override async Task HandleAsync(UserDeleteRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _userService.GetByIdAsync(request.Id);
        if (entity == null)
        {
            await SendNotFoundAsync();
            return;
        }
        if (entity.Default)
            ThrowError("Default user can not be deleted.");

        // Delete the entity from the db
        await _userService.DeleteAsync(request.Id);
        await SendAsync(new UserDeleteResponse { Success = true });
    }
}

sealed class UserDeleteRequest
{
    public Guid Id { get; set; }
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
    public string Message { get; set; }
}


