using FastEndpointsTool.Extensions;
using FastEndpointsTool.Parsing.Endpoint;

namespace FastEndpointsTool.Templates.Endpoint;

public class EndpointWithoutRequestTemplate : TemplateBase<EndpointArgument>
{
    public override string Template(EndpointArgument arg)
    {
        var template = $@"
sealed class {arg.Name}Endpoint : EndpointWithoutRequest<{arg.Name}Response>
{{
    public override void Configure()
    {{
        {arg.Method.ToPascalCase()}(""{arg.Url}"");
        {(!string.IsNullOrWhiteSpace(arg.Group) ? $"Group<{arg.Group}>();" : string.Empty)}
    }}

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {{
        await SendAsync(new {arg.Name}Response
        {{
            // Add your response properties here
        }});
    }}
}}

sealed class {arg.Name}Response
{{
    // Define response properties here
}}
";

        if (string.IsNullOrWhiteSpace(arg.Group))
            template = DeleteLine(template, 6);
        return template;
    }
}
