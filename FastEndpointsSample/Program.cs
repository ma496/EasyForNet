using FastEndpoints.Swagger;
using FastEndpointsSample.Data;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

var builder = WebApplication.CreateBuilder();
var configuration = builder.Configuration;
builder.Services
    .AddEndpointsApiExplorer()
    .AddFastEndpoints(opt =>
    {
        opt.Assemblies = new List<Assembly> { Assembly.GetExecutingAssembly() };
    })
    .AddSwaggerDocument(o =>
    {
        o.Title = "Sample";
        o.Version = "v1";
    });
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));


var app = builder.Build();

// Migrate database on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

app.UseFastEndpoints(x => x.Endpoints.RoutePrefix = "api/v1")
    .UseSwaggerGen();
app.Run();
