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

        var template = $@"
sealed class {name}Endpoint : Endpoint<{name}Request, {name}Response, {name}Mapper>
{{
    public override void Configure()
    {{
        Get(""{Path.Combine(arg.Url ?? string.Empty, $"{{{GetIdProperty(assembly, arg.Entity, arg.EntityFullName).Name.ToLower()}}}")}"");
        {(!string.IsNullOrWhiteSpace(arg.Group) ? $"Group<{arg.Group}>();" : string.Empty)}
        AllowAnonymous();
    }}

    public override async Task HandleAsync({name}Request request, CancellationToken cancellationToken)
    {{
        var entity = new {arg.Entity}(); // get entity from db
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
    {GetPropertiesCode(GetScalarProperties(assembly, arg.Entity, arg.EntityFullName, true))}
}}

sealed class {name}Mapper : Mapper<{name}Request, {name}Response, {arg.Entity}>
{{
    public override {name}Response FromEntity({arg.Entity} e)
    {{
        return new {name}Response
        {{
            {MappingPropertiesCode(assembly, arg.Entity, arg.EntityFullName, "e", true)}
        }};
    }}
}}
";


        if (string.IsNullOrWhiteSpace(arg.Group))
            template = DeleteLine(template, 6);
        return template;
    }
}