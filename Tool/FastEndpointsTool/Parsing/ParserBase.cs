using FastEndpointsTool.Extensions;

namespace FastEndpointsTool.Parsing;

public abstract class ParserBase<TArgument>
    where TArgument : Argument
{
    public abstract Argument Parse(string[] args);

    //protected abstract void SetEndpointArguments(TArgument argument, Dictionary<string, string> endpointArguments);

    protected void SetEndpointArguments(Enum argumentType, TArgument argument, Dictionary<string, string> endpointArguments)
    {
        var argumentInfoList = ArgumentInfo.Arguments()
            .Where(x => x.Type.Equals(argumentType))
            .ToList();

        if (argumentInfoList.Count == 0)
            throw new Exception($"No argument info object found for {argumentType}");
        if (argumentInfoList.Count > 1)
            throw new Exception($"More then one argument info objects found for {argumentType}");

        var argumentInfo = argumentInfoList[0];
        var usedArguments = new HashSet<string>();
        foreach (var opt in argumentInfo.Options)
        {
            if (!opt.IsInternal && (endpointArguments.ContainsKey(opt.Name) || endpointArguments.ContainsKey(opt.ShortName)))
            {
                var key = endpointArguments.ContainsKey(opt.Name) ? opt.Name : opt.ShortName;
                SetProperty(argument, endpointArguments[key], opt);
                usedArguments.Add(key);
            }
            else if (opt.IsInternal)
            {
                SetProperty(argument, opt.Default, opt);
            }
            else if (!opt.IsInternal && opt.Required)
                throw new UserFriendlyException($"{opt.ShortName} or {opt.Name} option can not be empty.");
        }
        foreach (var item in endpointArguments)
        {
            if (!usedArguments.Contains(item.Key))
                throw new UserFriendlyException($"{item.Key} is unknown option.");
        }
    }

    private static void SetProperty(TArgument argument, string value, ArgumentOption opt)
    {
        value = opt.NormalizeMethod != null ? opt.NormalizeMethod.Invoke(value) : value;
        var propertyName = opt.Name.Substring(2).ToPascalCase();
        var property = argument.GetType().GetProperty(propertyName);
        if (property == null)
            throw new Exception($"{propertyName} not found in {argument.GetType().FullName}");
        if (string.IsNullOrWhiteSpace(value))
            value = opt.Default;
        if (opt.Required && string.IsNullOrWhiteSpace(value))
            throw new UserFriendlyException($"{opt.ShortName} or {opt.Name} can not be empty.");
        property.SetValue(argument, value);
    }

    protected string[] GetOptions(string[] array)
    {
        if (array.Length == 1)
            throw new UserFriendlyException("Please provide options.");
        return SubArray(array, 1);
    }

    protected string[] SubArray(string[] array, int startIndex)
    {
        var subArray = new List<string>();
        for (var i = startIndex; i < array.Length; i++)
        {
            subArray.Add(array[i]);
        }
        return subArray.ToArray();
    }

    protected Dictionary<string, string> ToKeyValue(string[] array)
    {
        if (array.Length % 2 != 0)
            throw new UserFriendlyException("Invalidate args.");

        var dict = new Dictionary<string, string>();
        for (var i = 0; i < array.Length; i += 2)
        {
            dict.Add(array[i], array[i + 1]);
        }
        return dict;
    }
}
