using Backend.Data.Entities.Base;
using Backend.Data.Entities.Identity;
using Backend.Services.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    private readonly ICurrentUserService _currentUserService;

    public AppDbContext(
        DbContextOptions<AppDbContext> options,
        ICurrentUserService currentUserService) : base(options)
    {
        _currentUserService = currentUserService;
    }

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

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Role>()
            .HasIndex(r => r.Name)
            .IsUnique();

        modelBuilder.Entity<Permission>()
            .HasIndex(p => p.Name)
            .IsUnique();

        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId);

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId);

        modelBuilder.Entity<RolePermission>()
            .HasKey(rp => new { rp.RoleId, rp.PermissionId });

        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Role)
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleId);

        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Permission)
            .WithMany(p => p.RolePermissions)
            .HasForeignKey(rp => rp.PermissionId);

        modelBuilder.Entity<AuthToken>()
            .HasOne(at => at.User)
            .WithMany(u => u.AuthTokens)
            .HasForeignKey(at => at.UserId);

        modelBuilder.Entity<Token>()
            .HasOne(t => t.User)
            .WithMany(u => u.Tokens)
            .HasForeignKey(t => t.UserId);
    }

    public override int SaveChanges()
    {
        var currentUserId = _currentUserService.GetCurrentUserId();
        var entries = ChangeTracker
            .Entries()
            .Where(e => (e.Entity is ICreatableEntity || e.Entity is IUpdatableEntity) && (
                e.State == EntityState.Added ||
                e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            if (entityEntry.State == EntityState.Added)
            {
                var entity = entityEntry.Entity as ICreatableEntity;
                if (entity != null)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                    entity.CreatedBy = currentUserId;
                }
            }
            else if (entityEntry.State == EntityState.Modified)
            {
                var entity = entityEntry.Entity as IUpdatableEntity;
                if (entity != null)
                {
                    entity.UpdatedAt = DateTime.UtcNow;
                    entity.UpdatedBy = currentUserId;
                }
            }
        }

        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.GetCurrentUserId();
        var entries = ChangeTracker
            .Entries()
            .Where(e => (e.Entity is ICreatableEntity || e.Entity is IUpdatableEntity) && (
                e.State == EntityState.Added ||
                e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            if (entityEntry.State == EntityState.Added)
            {
                var entity = entityEntry.Entity as ICreatableEntity;
                if (entity != null)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                    entity.CreatedBy = currentUserId;
                }
            }
            else if (entityEntry.State == EntityState.Modified)
            {
                var entity = entityEntry.Entity as IUpdatableEntity;
                if (entity != null)
                {
                    entity.UpdatedAt = DateTime.UtcNow;
                    entity.UpdatedBy = currentUserId;
                }
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
