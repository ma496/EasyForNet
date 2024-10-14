namespace FastEndpointsTool.Parsing.Endpoint;

public class EndpointArgumentParser : ParserBase<EndpointArgument>
{
    public override Argument? Parse(string[] args)
    {
        if (args[0] == "endpoint" || args[0] == "ep")
        {
            var argument = new EndpointArgument { Type = EndpointType.Endpoint };
            var endpointArguments = ToKeyValue(GetOptions(args));

            SetEndpointArguments(EndpointType.Endpoint, argument, endpointArguments);

            return argument;
        }
        if (args[0] == "endpointwithoutmapper" || args[0] == "epwm")
        {
            var argument = new EndpointArgument { Type = EndpointType.EndpointWithoutMapper };
            var endpointArguments = ToKeyValue(GetOptions(args));

            SetEndpointArguments(EndpointType.EndpointWithoutMapper, argument, endpointArguments);

            return argument;
        }
        if (args[0] == "endpointwithoutresponse" || args[0] == "epwr")
        {
            var argument = new EndpointArgument { Type = EndpointType.EndpointWithoutResponse };
            var endpointArguments = ToKeyValue(GetOptions(args));

            SetEndpointArguments(EndpointType.EndpointWithoutResponse, argument, endpointArguments);

            return argument;
        }
        if (args[0] == "endpointwithoutrequest" || args[0] == "epwreq")
        {
            var argument = new EndpointArgument { Type = EndpointType.EndpointWithoutRequest };
            var endpointArguments = ToKeyValue(GetOptions(args));

            SetEndpointArguments(EndpointType.EndpointWithoutRequest, argument, endpointArguments);

            return argument;
        }
        if (args[0] == "endpointwithoutresponseandrequest" || args[0] == "epwrreq")
        {
            var argument = new EndpointArgument { Type = EndpointType.EndpointWithoutResponseAndRequest };
            var endpointArguments = ToKeyValue(GetOptions(args));

            SetEndpointArguments(EndpointType.EndpointWithoutResponseAndRequest, argument, endpointArguments);

            return argument;
        }
        if (args[0] == "createendpoint" || args[0] == "cep")
        {
            var argument = new EndpointArgument { Type = EndpointType.CreateEndpoint };
            var endpointArguments = ToKeyValue(GetOptions(args));

            SetEndpointArguments(EndpointType.CreateEndpoint, argument, endpointArguments);

            return argument;
        }
        if (args[0] == "updateendpoint" || args[0] == "uep")
        {
            var argument = new EndpointArgument { Type = EndpointType.UpdateEndpoint };
            var endpointArguments = ToKeyValue(GetOptions(args));

            SetEndpointArguments(EndpointType.UpdateEndpoint, argument, endpointArguments);

            return argument;
        }
        if (args[0] == "getendpoint" || args[0] == "gep")
        {
            var argument = new EndpointArgument { Type = EndpointType.GetEndpoint };
            var endpointArguments = ToKeyValue(GetOptions(args));

            SetEndpointArguments(EndpointType.GetEndpoint, argument, endpointArguments);

            return argument;
        }
        if (args[0] == "listendpoint" || args[0] == "lep")
        {
            var argument = new EndpointArgument { Type = EndpointType.ListEndpoint };
            var endpointArguments = ToKeyValue(GetOptions(args));

            SetEndpointArguments(EndpointType.ListEndpoint, argument, endpointArguments);

            return argument;
        }
        if (args[0] == "deleteendpoint" || args[0] == "dep")
        {
            var argument = new EndpointArgument { Type = EndpointType.DeleteEndpoint };
            var endpointArguments = ToKeyValue(GetOptions(args));

            SetEndpointArguments(EndpointType.DeleteEndpoint, argument, endpointArguments);

            return argument;
        }

        return null;
    }
}
