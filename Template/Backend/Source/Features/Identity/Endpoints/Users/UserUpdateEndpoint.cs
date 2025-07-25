using Backend.Base.Dto;
using Backend.ErrorHandling;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Allow = Backend.Permissions.Allow;

namespace Backend.Features.Identity.Endpoints.Users;

sealed class UserUpdateEndpoint : Endpoint<UserUpdateRequest, UserUpdateResponse, UserUpdateMapper>
{
    private readonly IUserService _userService;

    public UserUpdateEndpoint(IUserService userService)
    {
        _userService = userService;
    }

    public override void Configure()
    {
        Put("{id}");
        Group<UsersGroup>();
        Permissions(Allow.User_Update);
    }

    public override async Task HandleAsync(UserUpdateRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _userService.Users()
            .Include(x => x.UserRoles)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity == null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }
        if (entity.Default)
            this.ThrowError("Default user cannot be updated", ErrorCodes.DefaultUserCannotBeUpdated);

        Map.UpdateEntity(request, entity);
        // update user roles based on request and already assigned roles
        var rolesToAssign = request.Roles.Where(x => !entity.UserRoles.Any(ur => ur.RoleId == x)).ToList();
        foreach (var role in rolesToAssign)
        {
            entity.UserRoles.Add(new UserRole { RoleId = role });
        }
        var rolesToRemove = entity.UserRoles.Where(x => !request.Roles.Contains(x.RoleId)).ToList();
        foreach (var role in rolesToRemove)
        {
            entity.UserRoles.Remove(role);
        }

        // save entity to db
        await _userService.UpdateAsync(entity);
        await SendAsync(Map.FromEntity(entity), cancellation: cancellationToken);
    }
}

sealed class UserUpdateRequest : BaseDto<Guid>
{
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsActive { get; set; }
    public List<Guid> Roles { get; set; } = [];
}

sealed class UserUpdateValidator : Validator<UserUpdateRequest>
{
    public UserUpdateValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(100);
        RuleFor(x => x.FirstName).MinimumLength(3).MaximumLength(50).When(x => !x.FirstName.IsNullOrEmpty());
        RuleFor(x => x.LastName).MinimumLength(3).MaximumLength(50).When(x => !x.LastName.IsNullOrEmpty());
    }
}

sealed class UserUpdateResponse : BaseDto<Guid>
{
    public string Email { get; set; } = null!;
    public string EmailNormalized { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsActive { get; set; }
    public List<Guid> Roles { get; set; } = [];
}

sealed class UserUpdateMapper : Mapper<UserUpdateRequest, UserUpdateResponse, User>
{
    public override User UpdateEntity(UserUpdateRequest r, User e)
    {
        e.Email = r.Email;
        e.FirstName = r.FirstName;
        e.LastName = r.LastName;
        e.IsActive = r.IsActive;

        return e;
    }

    public override UserUpdateResponse FromEntity(User e)
    {
        return new UserUpdateResponse
        {
            Id = e.Id,
            Email = e.Email,
            EmailNormalized = e.EmailNormalized,
            FirstName = e.FirstName,
            LastName = e.LastName,
            IsActive = e.IsActive,
            Roles = e.UserRoles.Select(x => x.RoleId).ToList(),
        };
    }
}


