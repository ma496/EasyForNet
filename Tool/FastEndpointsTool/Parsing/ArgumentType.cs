namespace FastEndpointsTool.Parsing;

public enum ArgumentType
{
    CreateProject = 1,
    Endpoint = 2,
    EndpointWithoutMapper = 3,
    EndpointWithoutResponse = 4,
    EndpointWithoutRequest = 5,
    EndpointWithoutResponseAndRequest = 6,
    CreateEndpoint = 7,
    UpdateEndpoint = 8,
    GetEndpoint = 9,
    ListEndpoint = 10,
    DeleteEndpoint = 11,
    CrudEndpoint = 12,
}
