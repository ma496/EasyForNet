namespace Backend.Tests;

using Backend.Tests.Architect;
using Microsoft.AspNetCore.Hosting;

/// <summary>
/// Main application fixture for the backend test project.
/// Configures the test host and registers test-specific services.
/// </summary>
public class App : AppFixture<Program>
{
    /// <summary>
    /// Performs one-time setup for the fixture before any tests run.
    /// </summary>
    protected override ValueTask SetupAsync()
    {
        // place one-time setup for the fixture here
        return new(Task.CompletedTask);
    }

    /// <summary>
    /// Configures the web host builder for the test application.
    /// </summary>
    protected override void ConfigureApp(IWebHostBuilder a)
    {
        // do host builder configuration here
    }

    /// <summary>
    /// Registers test-specific services into the dependency injection container.
    /// </summary>
    protected override void ConfigureServices(IServiceCollection s)
    {
        // do test service registration here
        s.AddScoped<IFeatureDependencyTester, FeatureDependencyTester>();
    }

    /// <summary>
    /// Performs cleanup after all tests using this fixture have completed.
    /// </summary>
    protected override ValueTask TearDownAsync()
    {
        // do cleanups here
        return new(Task.CompletedTask);
    }
}