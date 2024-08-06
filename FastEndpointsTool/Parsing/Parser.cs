namespace FastEndpointsTool.Parsing;

public class Parser
{
    public ParseArgument Parse(string[] args)
    {
        if (args.Length < 2)
            throw new Exception($"Invalidate arguments.");

        if (args[0] == "endpoint" || args[0] == "ep")
        {
            var argument = new ParseEndpointArgument { Type = EndpointType.Endpoint };
            var endpointArguments = ToDictionary(SubArray(args, 1));

            SetEndpointArguments(argument, endpointArguments);

            return argument;
        }
        if (args[0] == "endpointwithoutmapper" || args[0] == "epwm")
        {
            var argument = new ParseEndpointArgument { Type = EndpointType.EndpointWithoutMapper };
            var endpointArguments = ToDictionary(SubArray(args, 1));

            SetEndpointArguments(argument, endpointArguments);

            return argument;
        }
        if (args[0] == "endpointwithoutresponse" || args[0] == "epwr")
        {
            var argument = new ParseEndpointArgument { Type = EndpointType.EndpointWithoutResponse };
            var endpointArguments = ToDictionary(SubArray(args, 1));

            SetEndpointArguments(argument, endpointArguments);

            return argument;
        }
        if (args[0] == "endpointwithoutrequest" || args[0] == "epwreq")
        {
            var argument = new ParseEndpointArgument { Type = EndpointType.EndpointWithoutRequest };
            var endpointArguments = ToDictionary(SubArray(args, 1));

            SetEndpointArguments(argument, endpointArguments);

            return argument;
        }
        if (args[0] == "endpointwithoutresponseandrequest" || args[0] == "epwrreq")
        {
            var argument = new ParseEndpointArgument { Type = EndpointType.EndpointWithoutResponseAndRequest };
            var endpointArguments = ToDictionary(SubArray(args, 1));

            SetEndpointArguments(argument, endpointArguments);

            return argument;
        }

        throw new Exception($"Invalidate arguments.");
    }

    #region Helpers

    private void SetEndpointArguments(ParseEndpointArgument argument, Dictionary<string, string> endpointArguments)
    {
        if (endpointArguments.ContainsKey("-n"))
            argument.Name = endpointArguments["-n"];
        else if (endpointArguments.ContainsKey("--name"))
            argument.Name = endpointArguments["--name"];

        if (endpointArguments.ContainsKey("-m"))
            argument.Method = endpointArguments["-m"];
        else if (endpointArguments.ContainsKey("--method"))
            argument.Method = endpointArguments["--method"];

        if (endpointArguments.ContainsKey("-u"))
            argument.Url = endpointArguments["-u"];
        else if (endpointArguments.ContainsKey("--url"))
            argument.Url = endpointArguments["--url"];

        if (endpointArguments.ContainsKey("-e") && argument.Type == EndpointType.Endpoint)
            argument.Entity = endpointArguments["-e"];
        else if (endpointArguments.ContainsKey("--entity") && argument.Type == EndpointType.Endpoint)
            argument.Entity = endpointArguments["--entity"];

        if (endpointArguments.ContainsKey("-o"))
            argument.Output = endpointArguments["-o"];
        else if (endpointArguments.ContainsKey("--output"))
            argument.Output = endpointArguments["--output"];

        if (string.IsNullOrWhiteSpace(argument.Name))
            throw new Exception("-n or --name can not be empty.");
        if (string.IsNullOrWhiteSpace(argument.Method))
            throw new Exception("-m or --method can not be empty.");
        if (string.IsNullOrWhiteSpace(argument.Url))
            throw new Exception("-u or --url can not be empty.");
        if (string.IsNullOrWhiteSpace(argument.Entity) && argument.Type == EndpointType.Endpoint)
            throw new Exception("-e or --entity can not be empty.");
    }

    private string[] SubArray(string[] array, int startIndex)
    {
        var subArray = new List<string>();
        for (var i = startIndex; i < array.Length; i++)
        {
            subArray.Add(array[i]);
        }
        return subArray.ToArray();
    }

    private Dictionary<string, string> ToDictionary(string[] array)
    {
        if (array.Length % 2 != 0)
            throw new Exception("Invalidate args.");

        var dict = new Dictionary<string, string>();
        for (var i = 0; i < array.Length; i += 2)
        {
            dict.Add(array[i], array[i + 1]);
        }
        return dict;
    }

    #endregion
}

