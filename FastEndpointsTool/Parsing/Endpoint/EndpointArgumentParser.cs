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

        return null;
    }

    //protected override void SetEndpointArguments(EndpointArgument argument, Dictionary<string, string> endpointArguments)
    //{
    //    if (endpointArguments.ContainsKey("-n"))
    //        argument.Name = endpointArguments["-n"];
    //    else if (endpointArguments.ContainsKey("--name"))
    //        argument.Name = endpointArguments["--name"];

    //    if (endpointArguments.ContainsKey("-m"))
    //        argument.Method = endpointArguments["-m"];
    //    else if (endpointArguments.ContainsKey("--method"))
    //        argument.Method = endpointArguments["--method"];

    //    if (endpointArguments.ContainsKey("-u"))
    //        argument.Url = endpointArguments["-u"];
    //    else if (endpointArguments.ContainsKey("--url"))
    //        argument.Url = endpointArguments["--url"];

    //    if (endpointArguments.ContainsKey("-e") && IsEntityRequired(argument.Type))
    //        argument.Entity = endpointArguments["-e"];
    //    else if (endpointArguments.ContainsKey("--entity") && IsEntityRequired(argument.Type))
    //        argument.Entity = endpointArguments["--entity"];

    //    if (endpointArguments.ContainsKey("-o"))
    //        argument.Output = endpointArguments["-o"];
    //    else if (endpointArguments.ContainsKey("--output"))
    //        argument.Output = endpointArguments["--output"];

    //    if (endpointArguments.ContainsKey("-g"))
    //        argument.Group = GroupName(endpointArguments["-g"]);
    //    else if (endpointArguments.ContainsKey("--group"))
    //        argument.Group = GroupName(endpointArguments["--group"]);

    //    if (string.IsNullOrWhiteSpace(argument.Name))
    //        throw new Exception("-n or --name can not be empty.");
    //    if (string.IsNullOrWhiteSpace(argument.Method))
    //        throw new Exception("-m or --method can not be empty.");
    //    if (string.IsNullOrWhiteSpace(argument.Url))
    //        throw new Exception("-u or --url can not be empty.");
    //    if (string.IsNullOrWhiteSpace(argument.Entity) && IsEntityRequired(argument.Type))
    //        throw new Exception("-e or --entity can not be empty.");
    //}

    private string GroupName(string group)
    {
        return group.EndsWith("Group") ? group : $"{group}Group";
    }

    private bool IsEntityRequired(EndpointType endpointType)
    {
        return endpointType == EndpointType.Endpoint
            || endpointType == EndpointType.CreateEndpoint;
    }
}
