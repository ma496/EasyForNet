using FastEndpoints;
using FluentValidation;
using Backend.Data.Entities;
using Backend.Data;

namespace Backend.Features.Users;

sealed class UserDeleteEndpoint : Endpoint<UserDeleteRequest, UserDeleteResponse>
{
    private readonly AppDbContext _dbContext;

    public UserDeleteEndpoint(AppDbContext context)
    {
        _dbContext = context;
    }

    public override void Configure()
    {
        Delete("{id}");
        Group<UsersGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(UserDeleteRequest request, CancellationToken cancellationToken)
    {
        // get entity from db
        var entity = await _dbContext.Users.FindAsync(request.Id, cancellationToken);; 
        if (entity == null)
        {
            await SendNotFoundAsync();
            return;
        }

        // Delete the entity from the db
        _dbContext.Users.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        await SendAsync(new UserDeleteResponse { Success = true });
    }
}

sealed class UserDeleteRequest
{
    public int Id { get; set; }
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


