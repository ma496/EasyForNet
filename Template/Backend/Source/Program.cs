using System.Security.Claims;
using Backend.Data;
using Backend.ErrorHandling;
using Backend.External.Email;
using Backend.Features.Identity.Core;
using Backend.Permissions;
using Backend.Settings;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;

var bld = WebApplication.CreateBuilder(args);

bld.Services
   .AddFastEndpoints(o => o.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All)
   .SwaggerDocument();

// Add CORS configuration
bld.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins(bld.Configuration["Web:Url"] ?? "http://localhost:3000")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

bld.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(bld.Configuration.GetConnectionString("DefaultConnection")));

bld.Services
    .AddAuthenticationCookie(TimeSpan.FromMinutes(bld.Configuration.GetValue<int>("Auth:AccessTokenValidity")))
    .AddAuthenticationJwtBearer(x => x.SigningKey = bld.Configuration["Auth:Jwt:Key"])
    .AddAuthentication(o =>
   {
       o.DefaultScheme = "Jwt_Or_Cookie";
       o.DefaultAuthenticateScheme = "Jwt_Or_Cookie";
   })
   .AddPolicyScheme("Jwt_Or_Cookie", "Jwt_Or_Cookie", o =>
   {
       o.ForwardDefaultSelector = ctx =>
       {
           if (ctx.Request.Headers.TryGetValue(HeaderNames.Authorization, out var authHeader) &&
               authHeader.FirstOrDefault()?.StartsWith("Bearer ") is true)
           {
               return JwtBearerDefaults.AuthenticationScheme;
           }
           return CookieAuthenticationDefaults.AuthenticationScheme;
       };
   });
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
bld.Services.Configure<WebSetting>(bld.Configuration.GetSection("Web"));

// configure services 
bld.Services.AddFeatures();
bld.Services.AddScoped<DataSeeder>();
bld.Services.AddSingleton<PermissionDefinitionContext>();
bld.Services.AddScoped<PermissionDefinitionProvider>();
bld.Services.AddScoped<IPermissionDefinitionService, PermissionDefinitionService>();

// Configure email services
bld.Services.Configure<EmailSetting>(bld.Configuration.GetSection("EmailSettings"));
bld.Services.AddScoped<IEmailService, EmailService>();
bld.Services.AddScoped<IEmailBackgroundJobs, EmailBackgroundJobs>();

var app = bld.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
    var permissionDefinitionProvider = scope.ServiceProvider.GetRequiredService<PermissionDefinitionProvider>();
    var permissionDefinitionContext = scope.ServiceProvider.GetRequiredService<PermissionDefinitionContext>();
    permissionDefinitionProvider.Define(permissionDefinitionContext);
    var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
    await seeder.SeedAsync();
}

app.UseMiddleware<UnsupportedMediaTypeMiddleware>();
app.UseMiddleware<DbUpdateExceptionHandlingMiddleware>();

app.UseCors()
   .UseAuthentication()
   .UseAuthorization()
   .UseFastEndpoints(
       c =>
       {
           c.Binding.ReflectionCache.AddFromBackend();
           c.Errors.UseProblemDetails();
           c.Endpoints.RoutePrefix = "api/v1";
           c.Security.RoleClaimType = ClaimTypes.Role;
           c.Security.PermissionsClaimType = ClaimConstants.Permission;
           c.Errors.UseProblemDetails(x =>
           {
               x.IndicateErrorCode = true;     //serializes the fluentvalidation error code
               x.TypeValue = "https://www.rfc-editor.org/rfc/rfc7231#section-6.5.1";
               x.TitleValue = "One or more validation errors occurred.";
               x.TitleTransformer = pd => pd.Status switch
               {
                   400 => "Validation Error",
                   404 => "Not Found",
                   _ => "One or more errors occurred!"
               };
           });
       })
   .UseSwaggerGen();

// Configure Hangfire dashboard after database is ready
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = [new HangfireAuthorizationFilter()]
});

// Move recurring jobs setup after database is ready
using (app.Services.CreateScope())
{
    RecurringJob.AddOrUpdate<IAuthTokenService>("delete-expired-auth-tokens", service => service.DeleteExpiredTokensAsync(), Cron.Daily);
    RecurringJob.AddOrUpdate<ITokenService>("delete-expired-tokens", service => service.DeleteExpiredTokensAsync(), Cron.Daily);
}

app.Run();

namespace Backend
{
    public class Program { }
}