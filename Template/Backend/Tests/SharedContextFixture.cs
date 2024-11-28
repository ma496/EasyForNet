using Backend.Auth;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Tests;

public class SharedContextFixture : AppFixture<Program>
{

    protected override async Task SetupAsync()
    {
        var dbContext = Services.GetRequiredService<AppDbContext>();
        if (await dbContext.Database.CanConnectAsync())
        {
            await dbContext.Database.EnsureDeletedAsync();
        }
        await dbContext.Database.MigrateAsync();

        var permissionDefinitionProvider = Services.GetRequiredService<PermissionDefinitionProvider>();
        var permissionDefinitionContext = Services.GetRequiredService<PermissionDefinitionContext>();
        permissionDefinitionProvider.Define(permissionDefinitionContext);
        var seeder = Services.GetRequiredService<DataSeeder>();
        await seeder.SeedAsync();
        var testsDataSeeder = Services.GetRequiredService<TestsDataSeeder>();
        await testsDataSeeder.SeedAsync();
    }

    protected override void ConfigureServices(IServiceCollection s)
    {
        s.AddScoped<TestsDataSeeder>();
    }
}
