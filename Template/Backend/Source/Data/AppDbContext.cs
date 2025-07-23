using System.Linq.Expressions;
using Backend.Data.Entities.Base;
using Backend.Features.Identity.Core;
using Backend.Features.Identity.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options,
                          ICurrentUserService currentUserService)
    : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<AuthToken> AuthTokens => Set<AuthToken>();
    public DbSet<Token> Tokens => Set<Token>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        SoftDeleteFilter(modelBuilder);
    }

    private void SoftDeleteFilter(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes()
                     .Where(t => typeof(ISoftDelete).IsAssignableFrom(t.ClrType)))
        {
            var parameter = Expression.Parameter(entityType.ClrType, "e");
            var isDeletedProp = Expression.Property(parameter, nameof(ISoftDelete.IsDeleted));
            var filter = Expression.Lambda(
                Expression.Equal(isDeletedProp, Expression.Constant(false)),
                parameter);

            modelBuilder.Entity(entityType.ClrType)
                        .HasQueryFilter(filter);
        }
    }

    public override int SaveChanges()
    {
        ApplySoftDeleteRules();
        NormalizeProperties();

        var currentUserId = currentUserService.GetCurrentUserId();
        var entries = ChangeTracker
            .Entries()
            .Where(e => (e.Entity is ICreatableEntity || e.Entity is IUpdatableEntity) && (
                e.State == EntityState.Added ||
                e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            if (entityEntry.State == EntityState.Added)
            {
                if (entityEntry.Entity is ICreatableEntity creatableEntity)
                {
                    creatableEntity.CreatedAt = DateTime.UtcNow;
                    creatableEntity.CreatedBy = currentUserId;
                }

                if (entityEntry.Entity is IUpdatableEntity updatableEntity)
                {
                    updatableEntity.UpdatedAt = DateTime.UtcNow;
                }
            }
            else if (entityEntry is { State: EntityState.Modified, Entity: IUpdatableEntity updatableEntity })
            {
                updatableEntity.UpdatedAt = DateTime.UtcNow;
                updatableEntity.UpdatedBy = currentUserId;
            }
        }

        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplySoftDeleteRules();
        NormalizeProperties();

        var currentUserId = currentUserService.GetCurrentUserId();
        var entries = ChangeTracker
            .Entries()
            .Where(e => (e.Entity is ICreatableEntity || e.Entity is IUpdatableEntity) && (
                e.State == EntityState.Added ||
                e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            if (entityEntry.State == EntityState.Added)
            {
                if (entityEntry.Entity is ICreatableEntity creatableEntity)
                {
                    creatableEntity.CreatedAt = DateTime.UtcNow;
                    creatableEntity.CreatedBy = currentUserId;
                }

                if (entityEntry.Entity is IUpdatableEntity updatableEntity)
                {
                    updatableEntity.UpdatedAt = DateTime.UtcNow;
                }
            }
            else if (entityEntry is { State: EntityState.Modified, Entity: IUpdatableEntity updatableEntity })
            {
                updatableEntity.UpdatedAt = DateTime.UtcNow;
                updatableEntity.UpdatedBy = currentUserId;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    private void NormalizeProperties()
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is IHasNormalizedProperties && (
                e.State == EntityState.Added ||
                e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            if (entityEntry.Entity is IHasNormalizedProperties hasNormalizedProperties)
            {
                hasNormalizedProperties.NormalizeProperties();
            }
        }
    }

    private void ApplySoftDeleteRules()
    {
        foreach (var entry in ChangeTracker.Entries<ISoftDelete>()
                                         .Where(e => e.State == EntityState.Deleted))
        {
            entry.State = EntityState.Modified;
            entry.Entity.IsDeleted = true;
            entry.Entity.DeletedAt = DateTime.UtcNow;
        }
    }
}
