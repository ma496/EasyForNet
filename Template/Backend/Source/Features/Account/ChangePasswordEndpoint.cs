using FluentValidation;
using Backend.Data;
using Backend.Services.Identity;
using Backend.ErrorHandling;

namespace Backend.Features.Account;

sealed class ChangePasswordEndpoint : Endpoint<ChangePasswordRequest>
{
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserService _userService;

    public ChangePasswordEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService, IUserService userService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _userService = userService;
    }

    public override void Configure()
    {
        Post("change-password");
        Group<AccountGroup>();
    }

    public override async Task HandleAsync(ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetCurrentUserId();
        var user = await _dbContext.Users.FindAsync([userId], cancellationToken);
        if (user is null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }
        var verified = await _userService.ValidatePasswordAsync(user, request.CurrentPassword);
        if (!verified)
        {
            this.ThrowError(x => x.CurrentPassword, "Current password is invalid", ErrorCodes.InvalidCurrentPassword);
            return;
        }
        await _userService.UpdatePasswordAsync(user, request.NewPassword);
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

