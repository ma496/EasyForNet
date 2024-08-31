namespace FastEndpointsTool.Templates;

public abstract class TemplateBase<TArgument> : ITemplate<TArgument>
    where TArgument : class
{
    public abstract string Template(TArgument arg);

    protected string DeleteLine(string input, int lineIndex)
    {
        string[] lines = input.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);

        if (lineIndex < 0 || lineIndex >= lines.Length)
        {
            return input; // Return the original string if out of bounds
        }

        // Remove the specified line
        lines[lineIndex] = null;

        // Reconstruct the string without the null (deleted) line
        return string.Join(Environment.NewLine, lines.Where(line => line != null));
    }
}
