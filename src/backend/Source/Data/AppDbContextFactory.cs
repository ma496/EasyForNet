namespace Backend.Data;

using Microsoft.EntityFrameworkCore.Design;

/// <summary>
/// Design-time factory used by the EF Core tools (for example when running
/// <c>dotnet ef migrations</c>) to construct an <see cref="AppDbContext"/>
/// without bootstrapping the full application host.
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    /// <summary>
    /// Builds an <see cref="AppDbContext"/> using the development connection
    /// string from <c>appsettings.Development.json</c>.
    /// </summary>
    /// <param name="args">Command line arguments passed by the EF Core tools.</param>
    /// <returns>A new <see cref="AppDbContext"/> instance configured for PostgreSQL.</returns>
    public AppDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.Development.json")
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));

        // Passing null for ICurrentUserService because it's not needed at design time
        return new AppDbContext(optionsBuilder.Options, null!);
    }
}
