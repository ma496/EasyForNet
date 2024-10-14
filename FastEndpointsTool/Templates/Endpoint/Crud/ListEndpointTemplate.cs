using FastEndpointsTool.Extensions;
using FastEndpointsTool.Parsing.Endpoint;

namespace FastEndpointsTool.Templates.Endpoint.Crud;

public class ListEndpointTemplate : TemplateBase<EndpointArgument>
{
    public override string Template(EndpointArgument arg)
    {
        var name = Helpers.EndpointName(arg.Name, arg.Type);
        var (setting, projectDir) = Helpers.GetSetting(Directory.GetCurrentDirectory()).Result;
        var assembly = Helpers.GetProjectAssembly(projectDir, setting.Project.Name);

        var template = $@"
sealed class {name}Endpoint : Endpoint<{name}Request, List<{name}Response>, {name}Mapper>
{{
    public override void Configure()
    {{
        Get(""{arg.Url}"");
        {(!string.IsNullOrWhiteSpace(arg.Group) ? $"Group<{arg.Group}>();" : string.Empty)}
        AllowAnonymous();
    }}

    public override async Task HandleAsync({name}Request request, CancellationToken cancellationToken)
    {{
        var entities = new List<{arg.Entity}>(); // get entities from db
        await SendAsync(Map.FromEntity(entities));
    }}
}}

sealed class {name}Request
{{
    public int Page {{ get; set; }} = 1;
    public int PageSize {{ get; set; }} = 10;
    // Add any additional filter properties here
}}

sealed class {name}Validator : Validator<{name}Request>
{{
    public {name}Validator()
    {{
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
        // Add additional validation rules here
    }}
}}

sealed class {name}Response
{{
    {GetPropertiesCode(GetScalarProperties(assembly, arg.Entity, arg.EntityFullName, true))}
}}

sealed class {name}Mapper : Mapper<{name}Request, List<{name}Response>, List<{arg.Entity}>>
{{
    public override List<{name}Response> FromEntity(List<{arg.Entity}> e)
    {{
        return e.Select(entity => new {name}Response
        {{
            {MappingPropertiesCode(assembly, arg.Entity, arg.EntityFullName, "entity", true)}
        }}).ToList();
    }}
}}
";

        if (string.IsNullOrWhiteSpace(arg.Group))
            template = DeleteLine(template, 6);
        return template;
    }
}
