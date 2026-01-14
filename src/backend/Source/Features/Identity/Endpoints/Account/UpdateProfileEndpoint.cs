namespace Backend.Features.Identity.Endpoints.Account;

using Backend.Features.Identity.Core;
using Backend.Features.FileManagement.Core;

sealed class UpdateProfileEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService,
    IFileService fileService)
    : Endpoint<UserUpdateProfileRequest, UserUpdateProfileResponse>
{
    public override void Configure()
    {
        Post("update-profile");
        Group<AccountGroup>();
    }

    public override async Task HandleAsync(UserUpdateProfileRequest request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetCurrentUserId();
        var user = await dbContext.Users.FindAsync([userId], cancellationToken);
        if (user is null)
        {
            await Send.NotFoundAsync(cancellationToken);
            return;
        }

        var oldImage = user.Image;

        user.Email = request.Email;
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Image = request.Image;

        await dbContext.SaveChangesAsync(cancellationToken);

        if (oldImage != user.Image)
        {
            if (!oldImage.IsNullOrEmpty())
            {
                await fileService.DeleteAsync(oldImage!);
            }
        }

        await Send.ResponseAsync(new()
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Image = user.Image,
        }, cancellation: cancellationToken);
    }
}

sealed class UserUpdateProfileRequest
{
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Image { get; set; }
}

sealed class UserUpdateProfileValidator : Validator<UserUpdateProfileRequest>
{
    public UserUpdateProfileValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(100);
        RuleFor(x => x.FirstName).MinimumLength(3).MaximumLength(50).When(x => !string.IsNullOrWhiteSpace(x.FirstName));
        RuleFor(x => x.LastName).MinimumLength(3).MaximumLength(50).When(x => !string.IsNullOrWhiteSpace(x.LastName));
    }
}

sealed class UserUpdateProfileResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Image { get; set; }
}


