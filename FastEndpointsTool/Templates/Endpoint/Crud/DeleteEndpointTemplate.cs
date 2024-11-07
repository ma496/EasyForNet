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

        var template = $@"
sealed class {name}Endpoint : Endpoint<{name}Request, {name}Response>
{{
    public override void Configure()
    {{
        Delete(""{Path.Combine(arg.Url ?? string.Empty, $"{{{GetIdProperty(assembly, arg.Entity, arg.EntityFullName).Name.ToLower()}}}")}"");
        {(!string.IsNullOrWhiteSpace(arg.Group) ? $"Group<{arg.Group}>();" : string.Empty)}
        AllowAnonymous();
    }}

    public override async Task HandleAsync({name}Request request, CancellationToken cancellationToken)
    {{
        var entity = new {arg.Entity}(); // get entity from db
        // Delete the entity from the database
        // You might want to add some logic here to check if the entity exists before deleting
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

        if (string.IsNullOrWhiteSpace(arg.Group))
            template = DeleteLine(template, 6);
        return template;
    }
}