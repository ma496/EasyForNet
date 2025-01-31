using FastEndpointsTool.Extensions;
using FastEndpointsTool.Parsing;

namespace FastEndpointsTool.Templates.Endpoint.Crud;

public class UpdateEndpointTemplate : TemplateBase<EndpointArgument>
{
    public override string Template(EndpointArgument arg)
    {
        var (setting, projectDir) = Helpers.GetSetting(Directory.GetCurrentDirectory()).Result;
        var assembly = Helpers.GetProjectAssembly(projectDir, setting.Project.Name);
        var constructorParams = new string[]
        {
            !string.IsNullOrWhiteSpace(arg.DataContext) ? $"{arg.DataContext} context" : string.Empty
        };
        var dtoMapping = GetDtoMapping(assembly, setting, arg.EntityFullName);
        var dtoBaseClass = GetDtoClass(dtoMapping.mapping, dtoMapping.entityBaseType);

        var template = $@"
sealed class {arg.Name}Endpoint : Endpoint<{arg.Name}Request, {arg.Name}Response, {arg.Name}Mapper>
{{
    {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"private readonly {arg.DataContext} _dbContext;" : RemoveLine(3, 4))}

    public {arg.Name}Endpoint({string.Join(", ", constructorParams)})
    {{
        {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"_dbContext = context;" : RemoveLine(7))}
    }}

    public override void Configure()
    {{
        {arg.Method.ToPascalCase()}(""{Helpers.JoinUrl(arg.Url ?? string.Empty, $"{{{GetIdProperty(assembly, arg.Entity, arg.EntityFullName).Name.ToLower()}}}")}"");
        {(!string.IsNullOrWhiteSpace(arg.Group) ? $"Group<{arg.Group}>();" : RemoveLine(13))}
        {(!string.IsNullOrWhiteSpace(arg.Permission) ? $"Permissions(Allow.{arg.Permission});" : "AllowAnonymous();")}
    }}

    public override async Task HandleAsync({arg.Name}Request request, CancellationToken cancellationToken)
    {{
        // get entity from db
        var entity = {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"await _dbContext.{arg.PluralName}.FindAsync([request.{GetIdProperty(assembly, arg.Entity, arg.EntityFullName).Name}], cancellationToken: cancellationToken);" : $"new {arg.Entity}()")}; 
        if (entity == null)
        {{
            await SendNotFoundAsync(cancellationToken);
            return;
        }}

        Map.UpdateEntity(request, entity);

        // save entity to db
        {(!string.IsNullOrWhiteSpace(arg.DataContext) ? $"await _dbContext.SaveChangesAsync(cancellationToken);" : RemoveLine(30))}
        await SendAsync(Map.FromEntity(entity), cancellation: cancellationToken);
    }}
}}

sealed class {arg.Name}Request
{{
    {GetPropertiesCode(GetScalarProperties(assembly, arg.Entity, arg.EntityFullName, true, arg.BaseProperties))}
}}

sealed class {arg.Name}Validator : Validator<{arg.Name}Request>
{{
    public {arg.Name}Validator()
    {{
        // Add validation rules here
    }}
}}

sealed class {(string.IsNullOrWhiteSpace(dtoBaseClass.className) ? $"{arg.Name}Response" : $"{arg.Name}Response : {dtoBaseClass.className}")}
{{
    {GetPropertiesCode(GetScalarProperties(assembly, arg.Entity, arg.EntityFullName,
        string.IsNullOrWhiteSpace(dtoBaseClass.className), 
        string.IsNullOrWhiteSpace(dtoBaseClass.className) ? arg.BaseProperties : "false"))}
}}

sealed class {arg.Name}Mapper : Mapper<{arg.Name}Request, {arg.Name}Response, {arg.Entity}>
{{
    public override {arg.Entity} UpdateEntity({arg.Name}Request r, {arg.Entity} e)
    {{
        {UpdatePropertiesCode(assembly, arg.Entity, arg.EntityFullName, "r", false, arg.BaseProperties, "e")}

        return e;
    }}

    public override {arg.Name}Response FromEntity({arg.Entity} e)
    {{
        return new {arg.Name}Response
        {{
            {MappingPropertiesCode(assembly, arg.Entity, arg.EntityFullName, "e", true, arg.BaseProperties)}
        }};
    }}
}}
";

        template = DeleteLines(template);
        if (!string.IsNullOrWhiteSpace(dtoBaseClass.namespaceName))
            arg.UsingNamespaces.Add(dtoBaseClass.namespaceName);
        template = Merge(arg.UsingNamespaces, arg.Namespace, template);
        return template;
    }
}
