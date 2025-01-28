using Backend.Data;
using Tests.Seeder;

namespace Tests;

public class SharedContextFixture : AppFixture<Backend.Program>
{

    protected override async Task SetupAsync()
    {
        var testsDataSeeder = Services.GetRequiredService<TestsDataSeeder>();
        await testsDataSeeder.SeedAsync();
    }

    protected override async Task TearDownAsync()
    {
        var dbContext = Services.GetRequiredService<AppDbContext>();
        await dbContext.Database.EnsureDeletedAsync();
    }

    protected override void ConfigureServices(IServiceCollection s)
    {
        s.AddScoped<TestsDataSeeder>();
    }
}
