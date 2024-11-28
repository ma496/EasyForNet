using FastEndpointsTool.Extensions;
using FastEndpointsTool.Parsing;

namespace FastEndpointsTool.Templates.Endpoint.Crud;

public class CrudGroupTemplate : TemplateBase<EndpointArgument>
{
    public override string Template(EndpointArgument arg)
    {
        var template = $@"
sealed class {arg.PluralName}Group : Group
{{
    public {arg.PluralName}Group()
    {{
        Configure(""{arg.PluralName.ToCamelCase()}"", ep => ep.Description(x => x.WithTags(""{arg.PluralName}"")));
    }}
}}
";

        template = Merge(arg.UsingNamespaces, arg.Namespace, template);
        return template;
    }
}

