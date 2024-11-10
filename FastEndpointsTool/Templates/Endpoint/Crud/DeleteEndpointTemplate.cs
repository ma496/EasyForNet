using FastEndpointsTool.Extensions;
using FastEndpointsTool.Parsing.Endpoint;

namespace FastEndpointsTool.Templates.Endpoint.Crud;

public class DeleteEndpointTemplate : TemplateBase<EndpointArgument>
{
    public override string Template(EndpointArgument arg)
    {
        var name = Helpers.EndpointName(arg.Name, arg.Type);
        var (setting, projectDir) = Helpers.GetSetting(Directory.GetCurrentDirectory()).Result;
        var assembly = Helpers.GetProjectAssembly(projectDir, setting.Project.Name);
        var constructorParams = new string[] { !string.IsNullOrWhiteSpace(arg.DataContext) ? $"{arg.DataContext} context" : string.Empty };

        var template = $@"
sealed class {name}Endpoint : Endpoint<{name}Request, {name}Response>
{{
    {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"private readonly {arg.DataContext} _dbContext;" : RemoveLine(3, 4))}

    public {name}Endpoint({string.Join(", ", constructorParams)})
    {{
        {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"_dbContext = context;" : RemoveLine(7))}
    }}

    public override void Configure()
    {{
        Delete(""{Path.Combine(arg.Url ?? string.Empty, $"{{{GetIdProperty(assembly, arg.Entity, arg.EntityFullName).Name.ToLower()}}}")}"");
        {(!string.IsNullOrWhiteSpace(arg.Group) ? $"Group<{arg.Group}>();" : RemoveLine(13))}
        AllowAnonymous();
    }}

    public override async Task HandleAsync({name}Request request, CancellationToken cancellationToken)
    {{
        // get entity from db
        var entity = {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"await _dbContext.{arg.PluralName}.FindAsync(request.{GetIdProperty(assembly, arg.Entity, arg.EntityFullName).Name}, cancellationToken);" : $"new {arg.Entity}()")}; 
        if (entity == null)
        {{
            await SendNotFoundAsync();
            return;
        }}

        // Delete the entity from the db
        {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"_dbContext.{arg.PluralName}.Remove(entity);" : RemoveLine(28))}
        {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"await _dbContext.SaveChangesAsync(cancellationToken);" : RemoveLine(29))}
        await SendAsync(new {name}Response {{ Success = true }});
    }}
}}

sealed class {name}Request
{{
    public {ConvertToAlias(GetIdProperty(assembly, arg.Entity, arg.EntityFullName).PropertyType.Name)} {GetIdProperty(assembly, arg.Entity, arg.EntityFullName).Name} {{ get; set; }}
}}

sealed class {name}Validator : Validator<{name}Request>
{{
    public {name}Validator()
    {{
        RuleFor(x => x.{GetIdProperty(assembly, arg.Entity, arg.EntityFullName).Name}).NotEmpty();
    }}
}}

sealed class {name}Response
{{
    public bool Success {{ get; set; }}
    public string Message {{ get; set; }}
}}
";

        template = DeleteLines(template);
        return template;
    }
}