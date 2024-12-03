using Backend.Auth;
using Backend.Data;
using Backend.DbErrorHandling;
using Backend.Services.Identity;
using Backend.Settings;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.EntityFrameworkCore;

var bld = WebApplication.CreateBuilder(args);

bld.Services
   .AddFastEndpoints(o => o.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All)
   .SwaggerDocument();

bld.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(bld.Configuration.GetConnectionString("DefaultConnection")));

bld.Services.AddAuthenticationJwtBearer(s => s.SigningKey = bld.Configuration["Auth:JwtKey"]);
bld.Services.AddAuthorization();
bld.Services.AddHttpContextAccessor();

// Add Hangfire services with PostgreSQL storage
bld.Services.AddHangfire(config =>
{
    config.SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
          .UseSimpleAssemblyNameTypeSerializer()
          .UseRecommendedSerializerSettings()
          .UsePostgreSqlStorage(options =>
              options.UseNpgsqlConnection(bld.Configuration.GetConnectionString("DefaultConnection")));
});

// Add the Hangfire server
bld.Services.AddHangfireServer();

// configure settings
bld.Services.Configure<AuthSetting>(bld.Configuration.GetSection("Auth"));

// add services
bld.Services.AddScoped<IUserService, UserService>();
bld.Services.AddScoped<IRoleService, RoleService>();
bld.Services.AddScoped<IPermissionService, PermissionService>();
bld.Services.AddScoped<ICurrentUserService, CurrentUserService>();
bld.Services.AddScoped<DataSeeder>();
bld.Services.AddSingleton<PermissionDefinitionContext>();
bld.Services.AddScoped<PermissionDefinitionProvider>();
bld.Services.AddScoped<IPermissionDefinitionService, PermissionDefinitionService>();
bld.Services.AddScoped<IAuthTokenService, AuthTokenService>();


var app = bld.Build();

// Configure Hangfire dashboard
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = [] // Replace with real authorization in production
});

app.UseMiddleware<DbUpdateExceptionHandlingMiddleware>();
app.UseAuthentication()
   .UseAuthorization()
   .UseFastEndpoints(
       c =>
       {
           c.Binding.ReflectionCache.AddFromBackend();
           c.Errors.UseProblemDetails();
           c.Endpoints.RoutePrefix = "api/v1";
           c.Security.PermissionsClaimType = ClaimConstants.Permission;
           c.Security.RoleClaimType = ClaimConstants.Role;
       })
   .UseSwaggerGen();


using (var scope = app.Services.CreateScope())
{
    // migrate database and seed data on startup
    if (!app.Environment.IsEnvironment("Testing"))
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        dbContext.Database.Migrate();
        var permissionDefinitionProvider = scope.ServiceProvider.GetRequiredService<PermissionDefinitionProvider>();
        var permissionDefinitionContext = scope.ServiceProvider.GetRequiredService<PermissionDefinitionContext>();
        permissionDefinitionProvider.Define(permissionDefinitionContext);
        var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
        await seeder.SeedAsync();
    }
    // add recurring jobs
    RecurringJob.AddOrUpdate<IAuthTokenService>("delete-expired-auth-tokens", service => service.DeleteExpiredTokensAsync(), Cron.Daily);
}

app.Run();

namespace Backend
{
    public partial class Program { }
}