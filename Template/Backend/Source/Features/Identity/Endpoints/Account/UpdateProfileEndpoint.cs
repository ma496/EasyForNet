using Backend.Base.Dto;
using Backend.Data;
using Backend.Features.Identity.Core;
using FluentValidation;

namespace Backend.Features.Identity.Endpoints.Account;

sealed class UpdateProfileEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService)
    : Endpoint<UserUpdateProfileRequest, UserUpdateProfileResponse>
{
    public override void Configure()
    {
        Post("update-profile");
        Group<AccountGroup>();
        AllowFileUploads();
    }

    public override async Task HandleAsync(UserUpdateProfileRequest request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetCurrentUserId();
        var user = await dbContext.Users.FindAsync([userId], cancellationToken);
        if (user is null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }

        user.Email = request.Email;
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Image = request.Image is not null
            ? new Data.Entities.Image
            {
                Data = await request.Image.GetBytesAsync(cancellationToken),
                ContentType = request.Image.ContentType,
                FileName = request.Image.FileName
            }
            : null;

        await dbContext.SaveChangesAsync(cancellationToken);

        await SendAsync(new()
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Image = user.Image is not null
                ? new ImageDto
                {
                    ImageBase64 = Convert.ToBase64String(user.Image.Data),
                    ContentType = user.Image.ContentType,
                    FileName = user.Image.FileName
                }
                : null,
        }, cancellation: cancellationToken);
    }
}

sealed class UserUpdateProfileRequest
{
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public IFormFile? Image { get; set; }
}

sealed class UserUpdateProfileValidator : Validator<UserUpdateProfileRequest>
{
    public UserUpdateProfileValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(100);
        RuleFor(x => x.FirstName).MinimumLength(3).MaximumLength(50);
        RuleFor(x => x.LastName).MinimumLength(3).MaximumLength(50);
        RuleFor(x => x.Image)
            .Must(x => x == null || x.Length <= 5_000_000)
            .WithMessage("Image size must be less than 5MB")
            .Must(x => x == null || x.ContentType == "image/png" || x.ContentType == "image/jpeg")
            .WithMessage("Only PNG and JPEG images are allowed");
    }
}

sealed class UserUpdateProfileResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public ImageDto? Image { get; set; }
}


