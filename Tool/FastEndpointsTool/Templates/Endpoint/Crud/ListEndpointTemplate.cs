using FastEndpointsTool.Parsing.Endpoint;

namespace FastEndpointsTool.Templates.Endpoint.Crud;

public class ListEndpointTemplate : TemplateBase<EndpointArgument>
{
    public override string Template(EndpointArgument arg)
    {
        var (setting, projectDir) = Helpers.GetSetting(Directory.GetCurrentDirectory()).Result;
        var assembly = Helpers.GetProjectAssembly(projectDir, setting.Project.Name);
        arg.UsingNamespaces.Add("Microsoft.EntityFrameworkCore");
        var constructorParams = new string[] { !string.IsNullOrWhiteSpace(arg.DataContext) ? $"{arg.DataContext} context" : string.Empty };

        var template = $@"
sealed class {arg.Name}Endpoint : Endpoint<{arg.Name}Request, List<{arg.Name}Response>, {arg.Name}Mapper>
{{
    {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"private readonly {arg.DataContext} _dbContext;" : RemoveLine(3, 4))}

    public {arg.Name}Endpoint({string.Join(", ", constructorParams)})
    {{
        {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"_dbContext = context;" : RemoveLine(7))}
    }}

    public override void Configure()
    {{
        Get(""{Helpers.JoinUrl(arg.Url)}"");
        {(!string.IsNullOrWhiteSpace(arg.Group) ? $"Group<{arg.Group}>();" : RemoveLine(13))}
        {(!string.IsNullOrWhiteSpace(arg.Permission) ? $"Permissions(Allow.{arg.Permission});" : "AllowAnonymous();")}
    }}

    public override async Task HandleAsync({arg.Name}Request request, CancellationToken cancellationToken)
    {{
        // get entities from db
        var entities = {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $@"await _dbContext.{arg.PluralName}.AsNoTracking().OrderByDescending(x => x.{(!string.IsNullOrWhiteSpace(setting.Project.SortingColumn) ? setting.Project.SortingColumn : "CreatedAt")}).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);" : $"new List<{arg.Entity}>()")}; 
        await SendAsync(Map.FromEntity(entities));
    }}
}}

sealed class {arg.Name}Request
{{
    public int Page {{ get; set; }} = 1;
    public int PageSize {{ get; set; }} = 10;
    // Add any additional filter properties here
}}

sealed class {arg.Name}Validator : Validator<{arg.Name}Request>
{{
    public {arg.Name}Validator()
    {{
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
        // Add additional validation rules here
    }}
}}

sealed class {arg.Name}Response
{{
    {GetPropertiesCode(GetScalarProperties(assembly, arg.Entity, arg.EntityFullName, true, arg.BaseProperties))}
}}

sealed class {arg.Name}Mapper : Mapper<{arg.Name}Request, List<{arg.Name}Response>, List<{arg.Entity}>>
{{
    public override List<{arg.Name}Response> FromEntity(List<{arg.Entity}> e)
    {{
        return e.Select(entity => new {arg.Name}Response
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
