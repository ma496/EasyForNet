namespace Backend.Features.Identity.Endpoints.Users;

using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;

sealed class UserCreateEndpoint(IUserService userService) : Endpoint<UserCreateRequest, UserCreateResponse>
{
    public override void Configure()
    {
        Post("");
        Group<UsersGroup>();
        Permissions(Allow.User_Create);
    }

    public override async Task HandleAsync(UserCreateRequest request, CancellationToken cancellationToken)
    {
        var requestMapper = new UserCreateRequestMapper();
        var entity = requestMapper.Map(request);
        // save entity to db
        await userService.CreateAsync(entity, request.Password);
        var responseMapper = new UserCreateResponseMapper();
        await Send.ResponseAsync(responseMapper.Map(entity), cancellation: cancellationToken);
    }
}

public sealed class UserCreateRequest
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsActive { get; set; }
    public List<Guid> Roles { get; set; } = [];
}

sealed class UserCreateValidator : Validator<UserCreateRequest>
{
    public UserCreateValidator()
    {
        RuleFor(x => x.Username).NotEmpty().MinimumLength(3).MaximumLength(50);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(100);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8).MaximumLength(50);
        RuleFor(x => x.FirstName).MinimumLength(3).MaximumLength(50).When(x => !x.FirstName.IsNullOrEmpty());
        RuleFor(x => x.LastName).MinimumLength(3).MaximumLength(50).When(x => !x.LastName.IsNullOrEmpty());
    }
}

public sealed class UserCreateResponse : BaseDto<Guid>
{
    public string Username { get; set; } = null!;
    public string UsernameNormalized { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string EmailNormalized { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsActive { get; set; }
    public List<Guid> Roles { get; set; } = [];
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Source)]
public partial class UserCreateRequestMapper
{
    [MapProperty("Roles", "UserRoles", Use = nameof(RolesToUserRoles)),
     MapperIgnoreSource(nameof(UserCreateRequest.Password))]
    public partial User Map(UserCreateRequest request);

    private static ICollection<UserRole> RolesToUserRoles(List<Guid> roles)
        => roles.Select(x => new UserRole { RoleId = x }).ToList();
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class UserCreateResponseMapper
{
    [MapProperty("UserRoles", "Roles", Use = nameof(UserRolesToRoles))]
    public partial UserCreateResponse Map(User entity);
    
    private static List<Guid> UserRolesToRoles(ICollection<UserRole> userRoles)
        => userRoles.Select(x => x.RoleId).ToList();
}

