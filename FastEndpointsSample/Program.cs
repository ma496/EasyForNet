using FastEndpoints.Swagger;
using System.Reflection;

var bld = WebApplication.CreateBuilder();
bld.Services
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

var app = bld.Build();
app.UseFastEndpoints(x => x.Endpoints.RoutePrefix = "api/v1")
    .UseSwaggerGen();
app.Run();
