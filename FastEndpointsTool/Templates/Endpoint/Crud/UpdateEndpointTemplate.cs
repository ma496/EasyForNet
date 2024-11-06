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

        var template = $@"
sealed class {name}Endpoint : Endpoint<{name}Request, {name}Response, {name}Mapper>
{{
    public override void Configure()
    {{
        {arg.Method.ToPascalCase()}(""{Path.Combine(arg.Url ?? string.Empty, $"{{{GetIdProperty(assembly, arg.Entity, arg.EntityFullName).Name.ToLower()}}}")}/"");
        {(!string.IsNullOrWhiteSpace(arg.Group) ? $"Group<{arg.Group}>();" : string.Empty)}
        AllowAnonymous();
    }}

    public override async Task HandleAsync({name}Request request, CancellationToken cancellationToken)
    {{
        var entity = new {arg.Entity}(); // get entity from db
        Map.UpdateEntity(request, entity);
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

        if (string.IsNullOrWhiteSpace(arg.Group))
            template = DeleteLine(template, 6);
        return template;
    }
}
