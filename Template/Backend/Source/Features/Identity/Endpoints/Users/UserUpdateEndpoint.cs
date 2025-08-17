using Backend.Base.Dto;
using Backend.ErrorHandling;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Backend.Permissions;
using Riok.Mapperly.Abstractions;

namespace Backend.Features.Identity.Endpoints.Users;

sealed class UserUpdateEndpoint(IUserService userService)
    : Endpoint<UserUpdateRequest, UserUpdateResponse>
{
    public override void Configure()
    {
        Put("{id}");
        Group<UsersGroup>();
        Permissions(Allow.User_Update);
    }

    public override async Task HandleAsync(UserUpdateRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await userService.Users()
            .Include(x => x.UserRoles)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (entity == null)
        {
            await SendNotFoundAsync(cancellationToken);
            return;
        }
        if (entity.Default)
            this.ThrowError("Default user cannot be updated", ErrorCodes.DefaultUserCannotBeUpdated);

        var requestMapper = new UserUpdateRequestMapper();
        requestMapper.Update(request, entity);
        // update user roles based on request and already assigned roles
        var rolesToAssign = request.Roles.Where(x => entity.UserRoles.All(ur => ur.RoleId != x)).ToList();
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
        await userService.UpdateAsync(entity);
        var responseMapper = new UserUpdateResponseMapper();
        await SendAsync(responseMapper.Map(entity), cancellation: cancellationToken);
    }
}

public sealed class UserUpdateRequest : BaseDto<Guid>
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

public sealed class UserUpdateResponse : BaseDto<Guid>
{
    public string Email { get; set; } = null!;
    public string EmailNormalized { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsActive { get; set; }
    public List<Guid> Roles { get; set; } = [];
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Source)]
public partial class UserUpdateRequestMapper
{
    [MapperIgnoreSource(nameof(UserUpdateRequest.Roles))]
    public partial void Update(UserUpdateRequest request, User entity);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class UserUpdateResponseMapper
{
    [MapProperty(nameof(User.UserRoles), nameof(UserUpdateResponse.Roles), Use = nameof(UserRolesToRoles))]
    public partial UserUpdateResponse Map(User entity);

    private static List<Guid> UserRolesToRoles(ICollection<UserRole> userRoles)
    {
        return userRoles.Select(x => x.RoleId).ToList();
    }
}


