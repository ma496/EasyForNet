namespace FastEndpointsTool.Parsing;

public abstract class ParserBase<TArgument>
    where TArgument : Argument
{
    public abstract Argument? Parse(string[] args);

    protected abstract void SetEndpointArguments(TArgument argument, Dictionary<string, string> endpointArguments);

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
            throw new Exception("Invalidate args.");

        var dict = new Dictionary<string, string>();
        for (var i = 0; i < array.Length; i += 2)
        {
            dict.Add(array[i], array[i + 1]);
        }
        return dict;
    }
}
