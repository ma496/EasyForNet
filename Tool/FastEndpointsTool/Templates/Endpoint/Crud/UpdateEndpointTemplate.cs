using FastEndpointsTool.Extensions;
using FastEndpointsTool.Parsing.Endpoint;

namespace FastEndpointsTool.Templates.Endpoint.Crud;

public class UpdateEndpointTemplate : TemplateBase<EndpointArgument>
{
    public override string Template(EndpointArgument arg)
    {
        var name = Helpers.EndpointName(arg.Name, arg.Type);
        var (setting, projectDir) = Helpers.GetSetting(Directory.GetCurrentDirectory()).Result;
        var assembly = Helpers.GetProjectAssembly(projectDir, setting.Project.Name);
        var constructorParams = new string[] 
        { 
            !string.IsNullOrWhiteSpace(arg.DataContext) ? $"{arg.DataContext} context" : string.Empty 
        };

        var template = $@"
sealed class {name}Endpoint : Endpoint<{name}Request, {name}Response, {name}Mapper>
{{
    {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"private readonly {arg.DataContext} _dbContext;" : RemoveLine(3, 4))}

    public {name}Endpoint({string.Join(", ", constructorParams)})
    {{
        {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"_dbContext = context;" : RemoveLine(7))}
    }}

    public override void Configure()
    {{
        {arg.Method.ToPascalCase()}(""{Path.Combine(arg.Url ?? string.Empty, $"{{{GetIdProperty(assembly, arg.Entity, arg.EntityFullName).Name.ToLower()}}}")}"");
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

        Map.UpdateEntity(request, entity);

        // save entity to db
        {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"await _dbContext.SaveChangesAsync(cancellationToken);" : RemoveLine(30))}
        await SendAsync(Map.FromEntity(entity));
    }}
}}

sealed class {name}Request
{{
    {GetPropertiesCode(GetScalarProperties(assembly, arg.Entity, arg.EntityFullName, true))}
}}

sealed class {name}Validator : Validator<{name}Request>
{{
    public {name}Validator()
    {{
        // Add validation rules here
    }}
}}

sealed class {name}Response
{{
    {GetPropertiesCode(GetScalarProperties(assembly, arg.Entity, arg.EntityFullName, true))}
}}

sealed class {name}Mapper : Mapper<{name}Request, {name}Response, {arg.Entity}>
{{
    public override {arg.Entity} UpdateEntity({name}Request r, {arg.Entity} e)
    {{
        {UpdatePropertiesCode(assembly, arg.Entity, arg.EntityFullName, "r", false, "e")}

        return e;
    }}

    public override {name}Response FromEntity({arg.Entity} e)
    {{
        return new {name}Response
        {{
            {MappingPropertiesCode(assembly, arg.Entity, arg.EntityFullName, "e", true)}
        }};
    }}
}}
";

        template = DeleteLines(template);
        template = Merge(arg.UsingNamespaces, arg.Namespace, template);
        return template;
    }
}
