namespace FastEndpointsTool.Parsing.Endpoint;

public enum EndpointType
{
    Endpoint = 1,
    EndpointWithoutMapper = 2,
    EndpointWithoutResponse = 3,
    EndpointWithoutRequest = 4,
    EndpointWithoutResponseAndRequest = 5,
    CreateEndpoint = 6,
    UpdateEndpoint = 7,
    GetEndpoint = 8,
    ListEndpoint = 9,
    DeleteEndpoint = 10,
}
