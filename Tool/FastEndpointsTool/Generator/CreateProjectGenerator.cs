using FastEndpointsTool.Parsing;
using System.Diagnostics;

namespace FastEndpointsTool.Generator;

public class CreateProjectGenerator : CodeGeneratorBase<CreateProjectArgument>
{
    public override async Task Generate(CreateProjectArgument argument)
    {
        var version = Helpers.GetVersion();
        var templateBaseDir = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "FastEndpointsTool",
            "Templates"
        );
        var versionedTemplateDir = Path.Combine(templateBaseDir, version);
        var gitUrl = "https://github.com/ma496/FastEndpointsTool.git";

        try
        {
            // Check if template exists for current version
            if (!Directory.Exists(versionedTemplateDir))
            {
                // Create template directory
                Directory.CreateDirectory(versionedTemplateDir);

                // Clone the repository - escape paths with quotes
                await ExecuteCommand("git", $"clone {gitUrl} \"{versionedTemplateDir}\"");

                // Checkout specific version - escape paths with quotes
                await ExecuteCommand("git", $"-C \"{versionedTemplateDir}\" checkout tags/v{version}");
            }

            // Copy the Backend template to the target directory
            var templatePath = Path.Combine(versionedTemplateDir, "Template", "Backend");
            var targetPath = Path.Combine(Directory.GetCurrentDirectory(), argument.Output ?? string.Empty, argument.Name);

            // Create target directory if it doesn't exist
            Directory.CreateDirectory(targetPath);

            // Copy template directory recursively
            CopyDirectory(templatePath, targetPath, true);

            // Replace "Backend" with the provided project name in all files and directories
            RenameFilesAndDirectories(targetPath, "Backend", argument.Name);
            await ReplaceInFiles(targetPath, "Backend", argument.Name);
        }
        catch (Exception ex)
        {
            // Cleanup versioned directory if something went wrong during cloning
            if (Directory.Exists(versionedTemplateDir) && !Directory.EnumerateFileSystemEntries(versionedTemplateDir).Any())
            {
                Directory.Delete(versionedTemplateDir, true);
            }
            throw new Exception($"Failed to generate project: {ex.Message}", ex);
        }
    }

    private async Task ExecuteCommand(string command, string arguments)
    {
        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = command,
                Arguments = arguments,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };

        process.Start();
        var output = await process.StandardOutput.ReadToEndAsync();
        var error = await process.StandardError.ReadToEndAsync();
        await process.WaitForExitAsync();

        if (process.ExitCode != 0)
            throw new Exception($"Command failed: {command} {arguments}\nError: {error}\nOutput: {output}");
    }

    private void CopyDirectory(string sourceDir, string targetDir, bool recursive)
    {
        var dir = new DirectoryInfo(sourceDir);
        DirectoryInfo[] dirs = dir.GetDirectories();

        Directory.CreateDirectory(targetDir);

        foreach (FileInfo file in dir.GetFiles())
        {
            string targetFilePath = Path.Combine(targetDir, file.Name);
            file.CopyTo(targetFilePath);
        }

        if (recursive)
        {
            foreach (DirectoryInfo subDir in dirs)
            {
                string newTargetDir = Path.Combine(targetDir, subDir.Name);
                CopyDirectory(subDir.FullName, newTargetDir, true);
            }
        }
    }

    private void RenameFilesAndDirectories(string directory, string oldValue, string newValue)
    {
        // Rename files first
        foreach (string filePath in Directory.GetFiles(directory, "*", SearchOption.AllDirectories))
        {
            string newFilePath = filePath.Replace(oldValue, newValue);
            if (filePath != newFilePath)
                File.Move(filePath, newFilePath);
        }

        // Rename directories (bottom-up to avoid breaking paths)
        foreach (string dirPath in Directory.GetDirectories(directory, "*", SearchOption.AllDirectories)
                                          .OrderByDescending(d => d.Length))
        {
            string newDirPath = dirPath.Replace(oldValue, newValue);
            if (dirPath != newDirPath)
                Directory.Move(dirPath, newDirPath);
        }
    }

    private async Task ReplaceInFiles(string directory, string oldValue, string newValue)
    {
        foreach (string filePath in Directory.GetFiles(directory, "*.*", SearchOption.AllDirectories))
        {
            if (Path.GetExtension(filePath).ToLower() is ".dll" or ".exe" or ".pdb")
                continue;

            string content = await File.ReadAllTextAsync(filePath);
            if (content.Contains(oldValue))
            {
                content = content.Replace(oldValue, newValue);
                await File.WriteAllTextAsync(filePath, content);
            }
        }
    }
}
