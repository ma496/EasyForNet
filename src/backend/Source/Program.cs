using System.Security.Claims;
using System.Text.Json.Serialization;
using Backend.External.Email;
using Backend.Features.Identity.Core;
using Backend.Settings;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Net.Http.Headers;
using Backend.Features.FileManagement.Core;
using Microsoft.AspNetCore.Http.Features;
using Backend.Processors;

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
bld.Services.Configure<SigninSetting>(bld.Configuration.GetSection("Signin"));
bld.Services.Configure<PayloadSetting>(bld.Configuration.GetSection("Payload"));
bld.Services.Configure<FileSetting>(bld.Configuration.GetSection("File"));
bld.Services.Configure<WebSetting>(bld.Configuration.GetSection("Web"));

// rely on middleware and FormOptions to enforce limits to avoid abrupt connection resets
bld.WebHost.ConfigureKestrel(o => o.Limits.MaxRequestBodySize = null);
bld.Services.Configure<FormOptions>(o => o.MultipartBodyLengthLimit = 1073741824); // 1024 mb

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

app.UseCors()
   .UseAuthentication()
   .UseAuthorization()
   .UseFastEndpoints(
       c =>
       {
            c.Serializer.Options.Converters.Add(new JsonStringEnumConverter());
            c.Endpoints.Configurator = ep =>
            {
                ep.PreProcessor<ToLargePayloadProcessor>(Order.Before);
                ep.PostProcessor<ExceptionProcessor>(Order.After);
                ep.PostProcessor<UnsupportedMediaTypeResponseProcessor>(Order.After);
            };
            // c.Binding.ReflectionCache.AddFromBackend();
            c.Endpoints.RoutePrefix = bld.Configuration.GetRequiredSection("RoutePrefix").Value;
            c.Versioning.Prefix = "v";
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
    RecurringJob.AddOrUpdate<IAuthTokenCleanService>("delete-expired-auth-tokens", service => service.DeleteExpiredTokensAsync(), Cron.Daily);
    RecurringJob.AddOrUpdate<ITokenCleanService>("delete-expired-tokens", service => service.DeleteExpiredTokensAsync(), Cron.Daily);
    RecurringJob.AddOrUpdate<IDeleteUnactiveFilesService>("delete-unactive-files", service => service.DeleteAsync(), Cron.Daily);
}

app.Run();

namespace Backend
{
    public class Program { }
}
