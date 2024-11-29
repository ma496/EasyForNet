namespace FastEndpointsTool.Parsing;

public enum ArgumentType
{
    CreateProject = 100,
    Init = 200,
    Endpoint = 300,
    EndpointWithoutMapper = 301,
    EndpointWithoutResponse = 302,
    EndpointWithoutRequest = 303,
    EndpointWithoutResponseAndRequest = 304,
    CreateEndpoint = 305,
    UpdateEndpoint = 306,
    GetEndpoint = 307,
    ListEndpoint = 308,
    DeleteEndpoint = 309,
    CrudEndpoint = 310,
}
