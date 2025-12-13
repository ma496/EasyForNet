using EasyForNetTool.Extensions;

namespace EasyForNetTool.Parsing;

public abstract class ParserBase
{
    public abstract Argument Parse(string[] args);

    //protected abstract void SetEndpointArguments(TArgument argument, Dictionary<string, string> endpointArguments);

    protected void SetOptions(Enum argumentType, Argument argument, Dictionary<string, string> options)
    {
        var argumentInfoList = ArgumentInfo.Arguments()
            .Where(x => x.Type.Equals(argumentType))
            .ToList();

        if (argumentInfoList.Count == 0)
            throw new Exception($"No argument info object found for {argumentType}");
        if (argumentInfoList.Count > 1)
            throw new Exception($"More then one argument info objects found for {argumentType}");

        var argumentInfo = argumentInfoList[0];
        var usedOptions = new HashSet<string>();
        foreach (var opt in argumentInfo.Options)
        {
            if (!opt.IsInternal && (options.ContainsKey(opt.Name) || options.ContainsKey(opt.ShortName)))
            {
                var key = options.ContainsKey(opt.Name) ? opt.Name : opt.ShortName;
                SetProperty(argument, options[key], opt);
                usedOptions.Add(key);
            }
            else if (opt.IsInternal)
            {
                SetProperty(argument, opt.Default, opt);
            }
            else if (!opt.IsInternal && opt.Required)
                throw new UserFriendlyException($"{opt.ShortName} or {opt.Name} option can not be empty.");
        }
        foreach (var opt in options)
        {
            if (!usedOptions.Contains(opt.Key))
                throw new UserFriendlyException($"{opt.Key} is unknown option.");
        }
    }

    private static void SetProperty(Argument argument, string value, ArgumentOption opt)
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
