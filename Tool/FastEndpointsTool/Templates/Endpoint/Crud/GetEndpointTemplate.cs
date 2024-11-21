using System.Formats.Tar;
using FastEndpointsTool.Extensions;
using FastEndpointsTool.Parsing.Endpoint;

namespace FastEndpointsTool.Templates.Endpoint.Crud;

public class GetEndpointTemplate : TemplateBase<EndpointArgument>
{
    public override string Template(EndpointArgument arg)
    {
        var name = Helpers.EndpointName(arg.Name, arg.Type);
        var (setting, projectDir) = Helpers.GetSetting(Directory.GetCurrentDirectory()).Result;
        var assembly = Helpers.GetProjectAssembly(projectDir, setting.Project.Name);
        var constructorParams = new string[] { !string.IsNullOrWhiteSpace(arg.DataContext) ? $"{arg.DataContext} context" : string.Empty };

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
        Get(""{Helpers.JoinUrl(arg.Url ?? string.Empty, $"{{{GetIdProperty(assembly, arg.Entity, arg.EntityFullName).Name.ToLower()}}}")}"");
        {(!string.IsNullOrWhiteSpace(arg.Group) ? $"Group<{arg.Group}>();" : RemoveLine(13))}
        {(arg.Authorization.ToLower() == "true" ? $"Permissions(Allow.{Helpers.PermissionName(arg.Name)});" : "AllowAnonymous();")}
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

        await SendAsync(Map.FromEntity(entity));
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
        // Add validation rules here
    }}
}}

sealed class {name}Response
{{
    {GetPropertiesCode(GetScalarProperties(assembly, arg.Entity, arg.EntityFullName, true, arg.BaseProperties))}
}}

sealed class {name}Mapper : Mapper<{name}Request, {name}Response, {arg.Entity}>
{{
    public override {name}Response FromEntity({arg.Entity} e)
    {{
        return new {name}Response
        {{
            {MappingPropertiesCode(assembly, arg.Entity, arg.EntityFullName, "e", true, arg.BaseProperties)}
        }};
    }}
}}
";

        template = DeleteLines(template);
        template = Merge(arg.UsingNamespaces, arg.Namespace, template);
        return template;
    }
}