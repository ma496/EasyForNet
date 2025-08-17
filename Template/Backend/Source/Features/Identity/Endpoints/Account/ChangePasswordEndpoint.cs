using Backend.Data;
using Backend.ErrorHandling;
using Backend.Features.Identity.Core;
using FluentValidation;

namespace Backend.Features.Identity.Endpoints.Account;

sealed class ChangePasswordEndpoint(AppDbContext dbContext,
                                    ICurrentUserService currentUserService,
                                    IUserService userService)
    : Endpoint<ChangePasswordRequest>
{
    public override void Configure()
    {
        Post("change-password");
        Group<AccountGroup>();
    }

    public override async Task HandleAsync(ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetCurrentUserId();
        var user = await dbContext.Users.FindAsync([userId], cancellationToken);
        if (user is null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }
        var verified = await userService.ValidatePasswordAsync(user, request.CurrentPassword);
        if (!verified)
        {
            this.ThrowError(x => x.CurrentPassword, "Current password is invalid", ErrorCodes.InvalidCurrentPassword);
            return;
        }
        await userService.UpdatePasswordAsync(user, request.NewPassword);
        await SendOkAsync(cancellationToken);
    }
}

sealed class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}

sealed class ChangePasswordValidator : Validator<ChangePasswordRequest>
{
    public ChangePasswordValidator()
    {
        RuleFor(x => x.CurrentPassword).NotEmpty();
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(8).MaximumLength(50);
    }
}

