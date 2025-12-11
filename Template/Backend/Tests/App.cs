namespace Backend.Tests;

using Backend.Tests.Architect;
using Microsoft.AspNetCore.Hosting;

public class App : AppFixture<Program>
{
    protected override ValueTask SetupAsync()
    {
        // place one-time setup for the fixture here
        return new(Task.CompletedTask);
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

    protected override ValueTask TearDownAsync()
    {
        // do cleanups here
        return new(Task.CompletedTask);
    }
}