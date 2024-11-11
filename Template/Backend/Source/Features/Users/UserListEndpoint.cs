using FastEndpoints;
using FluentValidation;
using Backend.Data.Entities;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Users;

sealed class UserListEndpoint : Endpoint<UserListRequest, List<UserListResponse>, UserListMapper>
{
    private readonly AppDbContext _dbContext;

    public UserListEndpoint(AppDbContext context)
    {
        _dbContext = context;
    }

    public override void Configure()
    {
        Get("");
        Group<UsersGroup>();
        AllowAnonymous();
    }

    public override async Task HandleAsync(UserListRequest request, CancellationToken cancellationToken)
    {
        // get entities from db
        var entities = await _dbContext.Users.OrderByDescending(x => x.Id).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);; 
        await SendAsync(Map.FromEntity(entities));
    }
}

sealed class UserListRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    // Add any additional filter properties here
}

sealed class UserListValidator : Validator<UserListRequest>
{
    public UserListValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
        // Add additional validation rules here
    }
}

sealed class UserListResponse
{
    public int Id { get; set; }
	public string Username { get; set; }
	public string Password { get; set; }
	public string Email { get; set; }
	public string Name { get; set; }
}

sealed class UserListMapper : Mapper<UserListRequest, List<UserListResponse>, List<User>>
{
    public override List<UserListResponse> FromEntity(List<User> e)
    {
        return e.Select(entity => new UserListResponse
        {
            Id = entity.Id,
			Username = entity.Username,
			Password = entity.Password,
			Email = entity.Email,
			Name = entity.Name,
        }).ToList();
    }
}


