namespace Backend.Tests;

/// <summary>
/// Shared fixture that seeds test data and authenticates once for the entire test collection.
/// The database is deleted during teardown.
/// </summary>
public class SharedContextFixture : AppFixture<Program>
{
    /// <summary>
    /// Authenticates the HTTP client and seeds test data into the database.
    /// </summary>
    protected override async ValueTask SetupAsync()
    {
        await TestsHelper.SetNewAuthTokenAsync(Client);
        var testsDataSeeder = Services.GetRequiredService<TestsDataSeeder>();
        await testsDataSeeder.SeedAsync(Client);
    }

    /// <summary>
    /// Deletes the test database after all tests in the collection have completed.
    /// </summary>
    protected override async ValueTask TearDownAsync()
    {
        await DeleteDatabaseAsync();
    }

    /// <summary>
    /// Registers the test data seeder into the service collection.
    /// </summary>
    protected override void ConfigureServices(IServiceCollection s)
    {
        s.AddScoped<TestsDataSeeder>();
    }
    
    /// <summary>
    /// Ensures the test database is deleted after test execution.
    /// </summary>
    private async Task DeleteDatabaseAsync()
    {
        var dbContext = Services.GetRequiredService<AppDbContext>();
        await dbContext.Database.EnsureDeletedAsync();
    }
}
