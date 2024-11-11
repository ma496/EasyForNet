using FastEndpointsTool.Extensions;
using FastEndpointsTool.Parsing.Endpoint;

namespace FastEndpointsTool.Templates.Endpoint;

public class EndpointWithoutResponseAndRequestTemplate : TemplateBase<EndpointArgument>
{
    public override string Template(EndpointArgument arg)
    {
        var template = $@"
sealed class {arg.Name}Endpoint : EndpointWithoutRequest
{{
    public override void Configure()
    {{
        {arg.Method.ToPascalCase()}(""{arg.Url}"");
        {(!string.IsNullOrWhiteSpace(arg.Group) ? $"Group<{arg.Group}>();" : RemoveLine(6))}
    }}

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {{
    }}
}}
";

        template = DeleteLines(template);
        return template;
    }
}
