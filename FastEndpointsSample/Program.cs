using System.Reflection;

var bld = WebApplication.CreateBuilder();
bld.Services.AddFastEndpoints(opt =>
{
    opt.Assemblies = new List<Assembly> { Assembly.GetExecutingAssembly() };
});

var app = bld.Build();
app.UseFastEndpoints();
app.Run();
