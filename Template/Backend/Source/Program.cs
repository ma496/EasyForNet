using Backend.Data;
using Backend.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var bld = WebApplication.CreateBuilder(args);
bld.Services
   .AddAuthenticationJwtBearer(s => s.SigningKey = bld.Configuration["Auth:JwtKey"])
   .AddAuthorization()
   .AddFastEndpoints(o => o.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All)
   .SwaggerDocument();

bld.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(bld.Configuration.GetConnectionString("DefaultConnection")));

bld.Services.AddIdentity<AppUser, AppRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

bld.Services.AddScoped<DataSeed>();


var app = bld.Build();

// migrate database and seed data on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
    var dataSeed = scope.ServiceProvider.GetRequiredService<DataSeed>();
    await dataSeed.SeedAsync();
}

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
app.Run();

public partial class Program { }