using FluentValidation;
using Backend.Data;
using Backend.Services.Identity;

namespace Backend.Features.Users;

sealed class UserUpdateProfileEndpoint : Endpoint<UserUpdateProfileRequest, UserUpdateProfileResponse>
{
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public UserUpdateProfileEndpoint(AppDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public override void Configure()
    {
        Put("update-profile");
        Group<UsersGroup>();
    }

    public override async Task HandleAsync(UserUpdateProfileRequest request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetCurrentUserId();
        var user = await _dbContext.Users.FindAsync([userId], cancellationToken);
        if (user is null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }

        user.Email = request.Email;
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await SendAsync(new UserUpdateProfileResponse
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
        }, cancellation: cancellationToken);
    }
}

sealed class UserUpdateProfileRequest
{
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}

sealed class UserUpdateProfileValidator : Validator<UserUpdateProfileRequest>
{
    public UserUpdateProfileValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(100);
        RuleFor(x => x.FirstName).MinimumLength(3).MaximumLength(50);
        RuleFor(x => x.LastName).MinimumLength(3).MaximumLength(50);
    }
}

sealed class UserUpdateProfileResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}


