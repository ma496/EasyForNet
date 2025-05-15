using FastEndpointsTool.Parsing;

namespace FastEndpointsTool.Templates.Endpoint.Crud;

public class ListEndpointTemplate : TemplateBase<EndpointArgument>
{
    public override string Template(EndpointArgument arg)
    {
        var (setting, projectDir) = Helpers.GetSetting(Directory.GetCurrentDirectory()).Result;
        var assembly = Helpers.GetProjectAssembly(projectDir, setting.Project.Name);
        arg.UsingNamespaces.Add("Microsoft.EntityFrameworkCore");
        var constructorParams = new string[]
        {
            !string.IsNullOrWhiteSpace(arg.DataContext) ? $"{arg.DataContext} context" : string.Empty
        };
        var dtoMapping = GetDtoMapping(assembly, setting, arg.EntityFullName);
        var dtoBaseClass = GetDtoClass(assembly, dtoMapping.mapping, dtoMapping.entityBaseType);
        var requestBaseType = GetNamespaceAndMemberName(setting.Project.Endpoints.ListEndpoint.RequestBaseType);
        var responseBaseType = GetNamespaceAndMemberName(setting.Project.Endpoints.ListEndpoint.ResponseBaseType);
        var processMethod = GetNamespaceAndMemberName(setting.Project.Endpoints.ListEndpoint.ProcessMethod);

        var template = $@"
sealed class {arg.Name}Endpoint : Endpoint<{arg.Name}Request, {arg.Name}Response, {arg.Name}Mapper>
{{
    {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"private readonly {arg.DataContext} _dbContext;" : RemoveLine(2))}

    public {arg.Name}Endpoint({string.Join(", ", constructorParams)})
    {{
        {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"_dbContext = context;" : RemoveLine())}
    }}

    public override void Configure()
    {{
        Get(""{Helpers.JoinUrl(arg.Url)}"");
        {(!string.IsNullOrWhiteSpace(arg.Group) ? $"Group<{arg.Group}>();" : RemoveLine())}
        {(!string.IsNullOrWhiteSpace(arg.Permission) ? $"Permissions(Allow.{arg.Permission});" : "AllowAnonymous();")}
    }}

    public override async Task HandleAsync({arg.Name}Request request, CancellationToken cancellationToken)
    {{
        // get entities from db
        {(!string.IsNullOrWhiteSpace(arg.DataContext)
            ? $"var query = _dbContext.{arg.PluralName}\n\t\t\t.AsNoTracking()\n\t\t\t.AsQueryable();" +
            "\n\n\t\tvar search = request.Search?.Trim()?.ToLower();" +
            "\n\t\tif (!string.IsNullOrWhiteSpace(search))\n\t\t{\n\t\t}" +
            "\n\n\t\tvar total = await query.CountAsync(cancellationToken);" +
            "\n\t\tvar items = await query\n\t\t\t.Process(request)\n\t\t\t.ToListAsync(cancellationToken);"
            : $"var items = new List<{arg.Entity}>();")}
        
        var response = new {arg.Name}Response
        {{
            Items = Map.FromEntity(items),
            Total = {(string.IsNullOrWhiteSpace(arg.DataContext) ? "0" : "total")}
        }};
        
        await SendAsync(response, cancellation: cancellationToken);
    }}
}}

sealed class {$"{arg.Name}Request : {requestBaseType.className}"}
{{
}}

sealed class {arg.Name}Validator : Validator<{arg.Name}Request>
{{
    public {arg.Name}Validator()
    {{
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }}
}}

sealed class {$"{arg.Name}Response : {responseBaseType.className}<{arg.Name}Dto>"}
{{
}}

sealed class {(string.IsNullOrWhiteSpace(dtoBaseClass.className) ? $"{arg.Name}Dto" : $"{arg.Name}Dto : {dtoBaseClass.className}")}
{{
    {GetPropertiesCode(GetScalarProperties(assembly, arg.Entity, arg.EntityFullName, dtoBaseClass))}
}}

sealed class {arg.Name}Mapper : Mapper<{arg.Name}Request, List<{arg.Name}Dto>, List<{arg.Entity}>>
{{
    public override List<{arg.Name}Dto> FromEntity(List<{arg.Entity}> e)
    {{
        return e.Select(entity => new {arg.Name}Dto
        {{
            {MappingPropertiesCode(GetScalarProperties(assembly, arg.Entity, arg.EntityFullName), "entity")}
        }}).ToList();
    }}
}}
";

        template = DeleteLines(template);
        if (!string.IsNullOrWhiteSpace(dtoBaseClass.namespaceName))
            arg.UsingNamespaces.Add(dtoBaseClass.namespaceName);
        if (!string.IsNullOrWhiteSpace(requestBaseType.namespaceName))
            arg.UsingNamespaces.Add(requestBaseType.namespaceName);
        if (!string.IsNullOrWhiteSpace(responseBaseType.namespaceName))
            arg.UsingNamespaces.Add(responseBaseType.namespaceName);
        if (!string.IsNullOrWhiteSpace(processMethod.namespaceName))
            arg.UsingNamespaces.Add(processMethod.namespaceName);
        template = Merge(arg.UsingNamespaces, arg.Namespace, template);
        return template;
    }
}
