using EasyForNetTool.Parsing;

namespace EasyForNetTool;


public class ArgumentInfo
{
    public ArgumentType Type { get; init; }
    public string Name { get; init; } = null!;
    public string ShortName { get; init; } = null!;
    public string Description { get; init; } = null!;
    public IList<ArgumentOption> Options { get; init; } = null!;

    public static IList<ArgumentInfo> Arguments()
    {
        return
        [
            new ArgumentInfo
            {
                Type = ArgumentType.CreateProject,
                Name = "createproject",
                ShortName = "cp",
                Description = "Create a new project.",
                Options =
                [
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of project.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of project.",
                        Required = false,
                    },
                ]
            },
        ];
    }
}

public class ArgumentOption
{
    public string Name { get; init; } = null!;
    public string ShortName { get; init; } = null!;
    public string Description { get; init; } = null!;
    public bool Required { get; init; }
    public string Default { get; set; } = null!;
    public bool IsInternal { get; set; }
    public Func<string, string>? NormalizeMethod { get; set; } = null!;
}
