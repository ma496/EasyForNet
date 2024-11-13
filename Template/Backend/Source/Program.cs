using Backend.Data;
using Backend.Data.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var bld = WebApplication.CreateBuilder(args);


bld.Services
   .AddFastEndpoints(o => o.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All)
   .SwaggerDocument();

bld.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(bld.Configuration.GetConnectionString("DefaultConnection")));

bld.Services.AddAuthenticationJwtBearer(s => s.SigningKey = bld.Configuration["Auth:JwtKey"]);

bld.Services.AddIdentity<AppUser, AppRole>()
    .AddEntityFrameworkStores<AppDbContext>();

//override the behavior or cookie auth scheme so that 401/403 will be returned.
bld.Services
   .ConfigureApplicationCookie(
       c =>
       {
           c.Events.OnRedirectToLogin
               = ctx =>
                 {
                     ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                     return Task.CompletedTask;
                 };
           c.Events.OnRedirectToAccessDenied
               = ctx =>
                 {
                     ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
                     return Task.CompletedTask;
                 };
       });

bld.Services.AddAuthentication(o => o.DefaultScheme = JwtBearerDefaults.AuthenticationScheme);
bld.Services.AddAuthorization();

bld.Services.AddScoped<DataSeed>();


var app = bld.Build();

app.UseAuthentication()
   .UseAuthorization()
   .UseFastEndpoints(
       c =>
       {
           c.Binding.ReflectionCache.AddFromBackend();
           c.Errors.UseProblemDetails();
           c.Endpoints.RoutePrefix = "api/v1";
       })
   .UseSwaggerGen();


// migrate database and seed data on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
    var dataSeed = scope.ServiceProvider.GetRequiredService<DataSeed>();
    await dataSeed.SeedAsync();
}

app.Run();

public partial class Program { }