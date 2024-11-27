using Backend.Data;
using Microsoft.AspNetCore.Hosting;

namespace Tests;

public class App : AppFixture<Program>
{
    protected override async Task SetupAsync()
    {

    }

    protected override void ConfigureApp(IWebHostBuilder a)
    {
        // do host builder configuration here
    }

    protected override void ConfigureServices(IServiceCollection s)
    {
        // do test service registration here
    }

    protected override async Task TearDownAsync()
    {
        // using var scope = Services.CreateScope();
        // var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        // await dbContext.Database.EnsureDeletedAsync();
    }
}