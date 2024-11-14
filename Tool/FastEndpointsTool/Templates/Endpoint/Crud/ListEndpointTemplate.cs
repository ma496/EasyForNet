using FastEndpointsTool.Parsing.Endpoint;

namespace FastEndpointsTool.Templates.Endpoint.Crud;

public class ListEndpointTemplate : TemplateBase<EndpointArgument>
{
    public override string Template(EndpointArgument arg)
    {
        var name = Helpers.EndpointName(arg.Name, arg.Type);
        var (setting, projectDir) = Helpers.GetSetting(Directory.GetCurrentDirectory()).Result;
        var assembly = Helpers.GetProjectAssembly(projectDir, setting.Project.Name);
        arg.UsingNamespaces.Add("Microsoft.EntityFrameworkCore");
        var constructorParams = new string[] { !string.IsNullOrWhiteSpace(arg.DataContext) ? $"{arg.DataContext} context" : string.Empty };

        var template = $@"
sealed class {name}Endpoint : Endpoint<{name}Request, List<{name}Response>, {name}Mapper>
{{
    {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"private readonly {arg.DataContext} _dbContext;" : RemoveLine(3, 4))}

    public {name}Endpoint({string.Join(", ", constructorParams)})
    {{
        {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"_dbContext = context;" : RemoveLine(7))}
    }}

    public override void Configure()
    {{
        Get(""{arg.Url}"");
        {(!string.IsNullOrWhiteSpace(arg.Group) ? $"Group<{arg.Group}>();" : RemoveLine(13))}
        AllowAnonymous();
    }}

    public override async Task HandleAsync({name}Request request, CancellationToken cancellationToken)
    {{
        // get entities from db
        var entities = {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $@"await _dbContext.{arg.PluralName}.OrderByDescending(x => x.{GetIdProperty(assembly, arg.Entity, arg.EntityFullName).Name}).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);" : $"new List<{arg.Entity}>()")}; 
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
    {GetPropertiesCode(GetScalarProperties(assembly, arg.Entity, arg.EntityFullName, true, arg.BaseProperties))}
}}

sealed class {name}Mapper : Mapper<{name}Request, List<{name}Response>, List<{arg.Entity}>>
{{
    public override List<{name}Response> FromEntity(List<{arg.Entity}> e)
    {{
        return e.Select(entity => new {name}Response
        {{
            {MappingPropertiesCode(assembly, arg.Entity, arg.EntityFullName, "entity", true, arg.BaseProperties)}
        }}).ToList();
    }}
}}
";

        template = DeleteLines(template);
        template = Merge(arg.UsingNamespaces, arg.Namespace, template);
        return template;
    }
}
