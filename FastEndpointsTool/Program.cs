using FastEndpointsTool.Generator;
using FastEndpointsTool.Parsing;
using System.Reflection;

namespace FastEndpointsTool;

internal class Program
{
    static async Task Main(string[] args)
    {
        var versionString = Assembly.GetEntryAssembly()?
                                    .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?
                                    .InformationalVersion
                                    .ToString();
        if (args.Length == 0)
        {
            Console.WriteLine($"fetool v{versionString}");
            Console.WriteLine("-------------");
            Console.WriteLine("\nUsage:");
            ShowHelp();
            return;
        }
        //if (args.Length == 1 && (args[0] == "--help" || args[0] == "-h"))
        //{
        //    ShowHelp();
        //    return;
        //}
        //if (args.Length == 1 && (args[0] == "--version" || args[0] == "-v"))
        //{
        //    Console.WriteLine($"fetool v{versionString}");
        //    return;
        //}

        var argument = new Parser().Parse(args);
        await new CodeGenerator().Generate(argument);
    }

    static void ShowHelp()
    {
        Console.WriteLine("  fetool help");
        var arguments = ArgumentInfo.Arguments();
        foreach (var arg in arguments)
        {
            Console.WriteLine($"  {arg.Name}, {arg.ShortName}, {arg.Description}");
            foreach (var opt in arg.Options)
            {
                Console.WriteLine($"    {opt.Name}, {opt.ShortName}, {opt.Description}");
            }
        }
    }
}