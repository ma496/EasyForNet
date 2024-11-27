using Backend.Auth;
using Backend.Data;
using Backend.Infrastructure;
using Backend.Services.Identity;
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

bld.Services.AddScoped<IUserService, UserService>();
bld.Services.AddScoped<IRoleService, RoleService>();
bld.Services.AddScoped<IPermissionService, PermissionService>();
bld.Services.AddScoped<ICurrentUserService, CurrentUserService>();
bld.Services.AddScoped<DataSeeder>();
bld.Services.AddScoped<TestsDataSeeder>();
bld.Services.AddSingleton<PermissionDefinitionContext>();
bld.Services.AddScoped<PermissionDefinitionProvider>();
bld.Services.AddScoped<IPermissionDefinitionService, PermissionDefinitionService>();


var app = bld.Build();

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


// migrate database and seed data on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (app.Environment.IsEnvironment("Testing"))
    {
        if (dbContext.Database.CanConnect())
            dbContext.Database.EnsureDeleted();
    }
    dbContext.Database.Migrate();
    var permissionDefinitionProvider = scope.ServiceProvider.GetRequiredService<PermissionDefinitionProvider>();
    var permissionDefinitionContext = scope.ServiceProvider.GetRequiredService<PermissionDefinitionContext>();
    permissionDefinitionProvider.Define(permissionDefinitionContext);
    var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
    await seeder.SeedAsync();
    if (app.Environment.IsEnvironment("Testing"))
    {
        var testsDataSeeder = scope.ServiceProvider.GetRequiredService<TestsDataSeeder>();
        await testsDataSeeder.SeedAsync();
    }
}

app.Run();

public partial class Program { }