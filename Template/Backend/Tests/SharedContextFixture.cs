namespace Backend.Tests;

public class SharedContextFixture : AppFixture<Program>
{
    protected override async ValueTask SetupAsync()
    {
        await TestsHelper.SetNewAuthTokenAsync(Client);
        var testsDataSeeder = Services.GetRequiredService<TestsDataSeeder>();
        await testsDataSeeder.SeedAsync(Client);
    }

    protected override async ValueTask TearDownAsync()
    {
        await DeleteDatabaseAsync();
    }

    protected override void ConfigureServices(IServiceCollection s)
    {
        s.AddScoped<TestsDataSeeder>();
    }
    
    private async Task DeleteDatabaseAsync()
    {
        var dbContext = Services.GetRequiredService<AppDbContext>();
        await dbContext.Database.EnsureDeletedAsync();
    }
}
