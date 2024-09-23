using FastEndpointsTool.Extensions;
using FastEndpointsTool.Parsing.Endpoint;

namespace FastEndpointsTool.Templates.Endpoint.Crud;

public class CreateEndpointTemplate : TemplateBase<EndpointArgument>
{
    public override string Template(EndpointArgument arg)
    {
        var name = Helpers.GetEndpointName(arg.Name, arg.Type);
        var (setting, projectDir) = Helpers.GetSetting(Directory.GetCurrentDirectory()).Result;
        var assembly = Helpers.GetProjectAssembly(projectDir, setting.Project.Name);

        var template = $@"
sealed class {name}Endpoint : Endpoint<{name}Request, {name}Response, {name}Mapper>
{{
    public override void Configure()
    {{
        {(!string.IsNullOrWhiteSpace(arg.Group) ? $"Group<{arg.Group}>();" : string.Empty)}
        {arg.Method.ToPascalCase()}(""{arg.Url}"");
    }}

    public override async Task HandleAsync({name}Request request, CancellationToken cancellationToken)
    {{
        await SendAsync(new {name}Response
        {{
            // Add your response properties here
        }});
    }}
}}

sealed class {name}Request
{{
    {GetPropertiesCode(GetScalarProperties(assembly, arg.Entity, arg.EntityFullName, false))}
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
    // Define mapping here
}}
";

        if (string.IsNullOrWhiteSpace(arg.Group))
            template = DeleteLine(template, 5);
        return template;
    }
}
