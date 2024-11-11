using FastEndpointsSample.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace FastEndpointsSample.Data;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Apply additional configurations here if needed
    }
}
