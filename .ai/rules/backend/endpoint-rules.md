# Backend Endpoint Rules

All backend endpoints must follow these conventions to ensure consistency and maintainability, taking the Identity feature's User endpoints as the gold standard.

## 1. Single File Rule
Every endpoint must have its own dedicated file. This file contains the endpoint class, the request class, the validator, the response class, and any mapping logic.

**Example Folder Structure:**
```text
Features/Identity/Endpoints/Users/
├── UserCreateEndpoint.cs
├── UserUpdateEndpoint.cs
├── UserGetEndpoint.cs
├── UserListEndpoint.cs
└── UsersGroup.cs
```

## 2. Class Definitions in Order
Classes should be defined in the following order within the file:
1. `Endpoint` Class
2. `Request` Class
3. `Validator` Class
4. `Response` Class
5. `Mapper` Class(es) (Partial classes for Mapperly)

## 3. Endpoint Configuration
- Use `Group<TGroup>()` to group related endpoints.
- Define HTTP method and route: `Post("")`, `Put("{id}")`, `Get("{id}")`, `Delete("{id}")`.
- Use `Permissions(Allow.Permission_Name)` for authorization.

## 4. Group Classes
Every related endpoints like `Users` must have a `Group` class to define the base route and common configuration for its endpoints.

**Example Group Class (`UsersGroup.cs`):**
```csharp
sealed class UsersGroup : Group
{
    public UsersGroup()
    {
        Configure("users", ep => { 
            // Unified configuration for all endpoints in this group
        });
    }
}
```

## 5. Handling Unique Columns
Before creating or updating an entity, check for unique column constraints using the DbContext. For normalized columns always normalize request values before comparison (e.g., `.Trim().ToLowerInvariant()`).

```csharp
var usernameExists = await dbContext.Users
    .AnyAsync(x => x.UsernameNormalized == request.Username.Trim().ToLowerInvariant(), cancellationToken);
if (usernameExists)
{
    ThrowError("Username already exists", ErrorCodes.UsernameAlreadyExists);
}
```

## 6. Permissions
### Usage in Endpoint
```csharp
public override void Configure()
{
    Post("");
    Group<UsersGroup>();
    Permissions(Allow.User_Create);
}
```

### Adding New Permissions
1. Add a constant to `src/backend/Source/Permissions/Allow.cs`:
   ```csharp
   public const string User_Create = "User.Create";
   ```
2. Register it in `src/backend/Source/Permissions/PermissionDefinitionProvider.cs`:
   ```csharp
   var identity = context.AddPermission("Identity", "Identity");
   var users = identity.AddChild("Users", "Users");
   users.AddChild(Allow.User_Create, "Create");
   ```

## 7. Mapperly Conventions & Mapping Rules
To maintain consistency, follow these specific Mapperly rules:

### Required Mapping Strategy
- **Request to Entity (`UserCreateRequest` -> `User`):** Use `RequiredMappingStrategy.Source`. This ensures every property in the Request is mapped or explicitly ignored.
- **Entity to Response (`User` -> `UserGetResponse`):** Use `RequiredMappingStrategy.Target`. This ensures every property in the Response is populated from the Entity.

### Mapping Properties with Different Names
Use the `[MapProperty]` attribute to map properties that have different names between the source and target.
```csharp
[MapProperty("Roles", "UserRoles")] // Source "Roles" maps to Target "UserRoles"
```

### Complex Mapping with Custom Methods
When names are different AND the types need conversion (e.g., `List<Guid>` to `ICollection<UserRole>`), use the `Use` parameter:
```csharp
[MapProperty("Roles", "UserRoles", Use = nameof(RolesToUserRoles))]
public partial User Map(UserCreateRequest request);

private static ICollection<UserRole> RolesToUserRoles(List<Guid> roles)
    => roles.Select(x => new UserRole { RoleId = x }).ToList();
```

### Ignoring Properties
Always ignore sensitive data (like `Password`) or properties handled manually (like `Roles` in an Update handler) using `[MapperIgnoreSource]` or `[MapperIgnoreTarget]`.
```csharp
[MapperIgnoreSource(nameof(UserCreateRequest.Password))] // Ignore Password in source
[MapperIgnoreTarget(nameof(User.EmailVerified))] // Ignore property in target
```

## 8. Endpoint Examples (User Pattern)

### Create Endpoint (POST)
```csharp
sealed class UserCreateEndpoint(IUserService userService, AppDbContext dbContext) : Endpoint<UserCreateRequest, UserCreateResponse>
{
    public override void Configure()
    {
        Post("");
        Group<UsersGroup>();
        Permissions(Allow.User_Create);
    }

    public override async Task HandleAsync(UserCreateRequest request, CancellationToken ct)
    {
        var usernameExists = await dbContext.Users
            .AnyAsync(x => x.UsernameNormalized == request.Username.Trim().ToLowerInvariant(), ct);
        if (usernameExists) ThrowError("Username already exists", ErrorCodes.UsernameAlreadyExists);

        var requestMapper = new UserCreateRequestMapper();
        var entity = requestMapper.Map(request);
        entity.IsEmailVerified = true;

        await userService.CreateAsync(entity, request.Password);
        
        var responseMapper = new UserCreateResponseMapper();
        await Send.ResponseAsync(responseMapper.Map(entity), cancellation: ct);
    }
}

public sealed class UserCreateRequest
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public List<Guid> Roles { get; set; } = [];
}

sealed class UserCreateValidator : Validator<UserCreateRequest>
{
    public UserCreateValidator()
    {
        RuleFor(x => x.Username).NotEmpty().MinimumLength(3).MaximumLength(50);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Roles).NotEmpty();
    }
}

public sealed class UserCreateResponse : BaseDto<Guid>
{
    public string Username { get; set; } = null!;
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
```

### Update Endpoint (PUT)
Note: For collection updates (like Roles), manually handle the diffing logic in the handler rather than relying purely on the mapper for the collection itself.

```csharp
sealed class UserUpdateEndpoint(IUserService userService) : Endpoint<UserUpdateRequest, UserUpdateResponse>
{
    public override void Configure()
    {
        Put("{id}");
        Group<UsersGroup>();
        Permissions(Allow.User_Update);
    }

    public override async Task HandleAsync(UserUpdateRequest request, CancellationToken ct)
    {
        var entity = await userService.Users()
            .Include(x => x.UserRoles)
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);
            
        if (entity == null) { await Send.NotFoundAsync(ct); return; }

        var requestMapper = new UserUpdateRequestMapper();
        requestMapper.Update(request, entity);
        
        // Collection Diffing Logic
        var rolesToAssign = request.Roles.Where(x => entity.UserRoles.All(ur => ur.RoleId != x)).ToList();
        foreach (var role in rolesToAssign) entity.UserRoles.Add(new UserRole { RoleId = role });
        
        var rolesToRemove = entity.UserRoles.Where(x => !request.Roles.Contains(x.RoleId)).ToList();
        foreach (var role in rolesToRemove) entity.UserRoles.Remove(role);

        await userService.UpdateAsync(entity);
        
        await Send.ResponseAsync(new UserUpdateResponseMapper().Map(entity), cancellation: ct);
    }
}

public sealed class UserUpdateRequest : BaseDto<Guid>
{
    public string? FirstName { get; set; }
    public List<Guid> Roles { get; set; } = [];
}

sealed class UserUpdateValidator : Validator<UserUpdateRequest>
{
    public UserUpdateValidator()
    {
        RuleFor(x => x.FirstName).MaximumLength(50);
    }
}

public sealed class UserUpdateResponse : BaseDto<Guid>
{
    public string? FirstName { get; set; }
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
        => userRoles.Select(x => x.RoleId).ToList();
}
```

### Get Endpoint (GET)
```csharp
sealed class UserGetEndpoint(IUserService userService) : Endpoint<UserGetRequest, UserGetResponse>
{
    public override void Configure()
    {
        Get("{id}");
        Group<UsersGroup>();
        Permissions(Allow.User_View);
    }

    public override async Task HandleAsync(UserGetRequest request, CancellationToken ct)
    {
        var entity = await userService.Users()
            .AsNoTracking()
            .Include(x => x.UserRoles)
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity == null) { await Send.NotFoundAsync(ct); return; }

        await Send.ResponseAsync(new UserGetResponseMapper().Map(entity), cancellation: ct);
    }
}

public sealed class UserGetRequest : BaseDto<Guid> { }

sealed class UserGetValidator : Validator<UserGetRequest> { }

public sealed class UserGetResponse : AuditableDto<Guid>
{
    public string Username { get; set; } = null!;
    public List<Guid> Roles { get; set; } = [];
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class UserGetResponseMapper
{
    [MapProperty("UserRoles", "Roles", Use = nameof(UserRolesToRoles))]
    public partial UserGetResponse Map(User entity);

    private static List<Guid> UserRolesToRoles(ICollection<UserRole> userRoles)
        => userRoles.Select(x => x.RoleId).ToList();
}
```

### List Endpoint (GET)
```csharp
sealed class UserListEndpoint(IUserService userService) : Endpoint<UserListRequest, UserListResponse>
{
    public override void Configure()
    {
        Get("");
        Group<UsersGroup>();
        Permissions(Allow.User_View);
    }

    public override async Task HandleAsync(UserListRequest request, CancellationToken ct)
    {
        var query = userService.Users()
            .AsNoTracking()
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .AsQueryable();

        var search = request.Search?.Trim().ToLowerInvariant();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                EF.Functions.Like(x.UsernameNormalized, $"%{search}%") ||
                EF.Functions.Like(x.EmailNormalized, $"%{search}%"));
        }

        var total = await query.CountAsync(ct);
        var items = await query.Process(request).ToListAsync(ct);

        var dtoMapper = new UserListDtoMapper();
        await Send.ResponseAsync(new UserListResponse
        {
            Items = items.Select(dtoMapper.Map).ToList(),
            Total = total
        }, cancellation: ct);
    }
}

public sealed class UserListRequest : ListRequestDto<Guid> { }

sealed class UserListValidator : Validator<UserListRequest>
{
    public UserListValidator()
    {
        Include(new ListRequestDtoValidator<Guid>());
    }
}

public sealed class UserListResponse : ListDto<UserListDto> { }

public sealed class UserListDto : AuditableDto<Guid>
{
    public string Username { get; set; } = null!;
    public List<UserRoleDto> Roles { get; set; } = [];
}

public sealed class UserRoleDto : BaseDto<Guid>
{
    public string Name { get; set; } = null!;
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class UserListDtoMapper
{
    [MapProperty("UserRoles", "Roles", Use = nameof(UserRolesToRoles))]
    public partial UserListDto Map(User entity);

    private static List<UserRoleDto> UserRolesToRoles(ICollection<UserRole> userRoles)
        => userRoles.Select(x => new UserRoleDto { Id = x.RoleId, Name = x.Role.Name }).ToList();
}
```
### Delete Endpoint (DELETE)
```csharp
sealed class UserDeleteEndpoint(IUserService userService) : Endpoint<UserDeleteRequest>
{
    public override void Configure()
    {
        Delete("{id}");
        Group<UsersGroup>();
        Permissions(Allow.User_Delete);
    }

    public override async Task HandleAsync(UserDeleteRequest request, CancellationToken ct)
    {
        var entity = await userService.Users().FirstOrDefaultAsync(x => x.Id == request.Id, ct);
        if (entity == null) { await Send.NotFoundAsync(ct); return; }

        await userService.DeleteAsync(entity);
        await Send.NoContentAsync(ct);
    }
}

public sealed class UserDeleteRequest : BaseDto<Guid> { }
```
