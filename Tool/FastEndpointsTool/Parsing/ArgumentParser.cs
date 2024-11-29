namespace FastEndpointsTool.Parsing;

public class ArgumentParser : ParserBase
{
    public override Argument Parse(string[] args)
    {
        if (args[0] == "createproject" || args[0] == "cp")
        {
            var argument = new CreateProjectArgument { Type = ArgumentType.CreateProject };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.CreateProject, argument, options);

            return argument;
        }
        if (args[0] == "initialize" || args[0] == "init")
        {
            var argument = new InitArgument { Type = ArgumentType.Init };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.Init, argument, options);

            return argument;
        }
        if (args[0] == "endpoint" || args[0] == "ep")
        {
            var argument = new EndpointArgument { Type = ArgumentType.Endpoint };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.Endpoint, argument, options);

            return argument;
        }
        if (args[0] == "endpointwithoutmapper" || args[0] == "epwm")
        {
            var argument = new EndpointArgument { Type = ArgumentType.EndpointWithoutMapper };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.EndpointWithoutMapper, argument, options);

            return argument;
        }
        if (args[0] == "endpointwithoutresponse" || args[0] == "epwr")
        {
            var argument = new EndpointArgument { Type = ArgumentType.EndpointWithoutResponse };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.EndpointWithoutResponse, argument, options);

            return argument;
        }
        if (args[0] == "endpointwithoutrequest" || args[0] == "epwreq")
        {
            var argument = new EndpointArgument { Type = ArgumentType.EndpointWithoutRequest };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.EndpointWithoutRequest, argument, options);

            return argument;
        }
        if (args[0] == "endpointwithoutresponseandrequest" || args[0] == "epwrreq")
        {
            var argument = new EndpointArgument { Type = ArgumentType.EndpointWithoutResponseAndRequest };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.EndpointWithoutResponseAndRequest, argument, options);

            return argument;
        }
        if (args[0] == "createendpoint" || args[0] == "cep")
        {
            var argument = new EndpointArgument { Type = ArgumentType.CreateEndpoint };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.CreateEndpoint, argument, options);

            return argument;
        }
        if (args[0] == "updateendpoint" || args[0] == "uep")
        {
            var argument = new EndpointArgument { Type = ArgumentType.UpdateEndpoint };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.UpdateEndpoint, argument, options);

            return argument;
        }
        if (args[0] == "getendpoint" || args[0] == "gep")
        {
            var argument = new EndpointArgument { Type = ArgumentType.GetEndpoint };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.GetEndpoint, argument, options);

            return argument;
        }
        if (args[0] == "listendpoint" || args[0] == "lep")
        {
            var argument = new EndpointArgument { Type = ArgumentType.ListEndpoint };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.ListEndpoint, argument, options);

            return argument;
        }
        if (args[0] == "deleteendpoint" || args[0] == "dep")
        {
            var argument = new EndpointArgument { Type = ArgumentType.DeleteEndpoint };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.DeleteEndpoint, argument, options);

            return argument;
        }
        if (args[0] == "crudendpoint" || args[0] == "crud")
        {
            var argument = new EndpointArgument { Type = ArgumentType.CrudEndpoint };
            var options = ToKeyValue(GetOptions(args));

            SetOptions(ArgumentType.CrudEndpoint, argument, options);

            return argument;
        }

        throw new UserFriendlyException($"{args[0]} is not a valid command.");
    }
}
