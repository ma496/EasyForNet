using Microsoft.AspNetCore.Hosting;
using Tests.Architect;

namespace Tests;

public class App : AppFixture<Backend.Program>
{
    protected override Task SetupAsync()
    {
        // place one-time setup for the fixture here
        return Task.CompletedTask;
    }

    protected override void ConfigureApp(IWebHostBuilder a)
    {
        // do host builder configuration here
    }

    protected override void ConfigureServices(IServiceCollection s)
    {
        // do test service registration here
        s.AddScoped<IFeatureDependencyTester, FeatureDependencyTester>();
    }

    protected override Task TearDownAsync()
    {
        // do cleanups here
        return Task.CompletedTask;
    }
}