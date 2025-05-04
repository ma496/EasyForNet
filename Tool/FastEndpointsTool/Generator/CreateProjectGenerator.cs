using FastEndpointsTool.Extensions;
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
            if (!Directory.Exists(versionedTemplateDir))
            {
                Console.WriteLine("Creating template directory...");
                Directory.CreateDirectory(versionedTemplateDir);

                Console.WriteLine("Cloning template repository...");
                try
                {
                    await ExecuteCommand("git", $"clone {gitUrl} \"{versionedTemplateDir}\"");
                }
                catch (Exception ex)
                {
                    throw new Exception($"Failed to clone template repository. Please ensure Git is installed and accessible. Error: {ex.Message}", ex);
                }

                Console.WriteLine($"Checking out version {version}...");
                try
                {
                    await ExecuteCommand("git", $"-C \"{versionedTemplateDir}\" checkout tags/v{version}");
                }
                catch (Exception ex)
                {
                    throw new Exception($"Failed to checkout version {version}. The version might not exist. Error: {ex.Message}", ex);
                }

                var gitFolder = Path.Combine(versionedTemplateDir, ".git");
                if (Directory.Exists(gitFolder))
                {
                    Directory.Delete(gitFolder, true);
                }
            }

            Console.WriteLine("Copying template files...");
            var backendProjectPath = Path.Combine(versionedTemplateDir, "Template", "Backend");
            var frontendProjectPath = Path.Combine(versionedTemplateDir, "Template", "Frontend", "fe-web");
            var pascalCaseProjectName = argument.Name.ToPascalCase();
            var kebabCaseProjectName = argument.Name.ToKebabCase();
            var targetPath = Path.Combine(Directory.GetCurrentDirectory(), argument.Output ?? string.Empty, kebabCaseProjectName);
            var backendTargetPath = Path.Combine(targetPath, "src", "backend");
            var frontendTargetPath = Path.Combine(targetPath, "src", "frontend");

            if (Directory.Exists(targetPath))
            {
                throw new UserFriendlyException($"Directory '{targetPath}' already exists. Please choose a different project name or location.");
            }

            Directory.CreateDirectory(targetPath);
            if (!Directory.Exists(backendTargetPath))
                Directory.CreateDirectory(backendTargetPath);
            if (!Directory.Exists(frontendTargetPath))
                Directory.CreateDirectory(frontendTargetPath);

            Console.WriteLine("Copying project files...");
            CopyDirectory(backendProjectPath, backendTargetPath, true);
            CopyDirectory(frontendProjectPath, frontendTargetPath, true);
            CopyFilesIfExists(versionedTemplateDir, targetPath, ".editorconfig", ".gitignore");

            Console.WriteLine("Customizing project files...");
            RenameFilesAndDirectories(backendTargetPath, "Backend", pascalCaseProjectName);
            await ReplaceInFiles(backendTargetPath, "Backend", pascalCaseProjectName);
            await ReplaceInFiles(frontendTargetPath, "fe-web", kebabCaseProjectName);

            Console.WriteLine("Creating solution file...");
            var solutionPath = Path.Combine(backendTargetPath, $"{pascalCaseProjectName}.sln");
            await ExecuteCommand("dotnet", $"new sln -n {pascalCaseProjectName} -o \"{Path.GetDirectoryName(solutionPath)}\"");

            // Add projects to solution
            var projectFiles = Directory.GetFiles(backendTargetPath, "*.csproj", SearchOption.AllDirectories);
            foreach (var projectFile in projectFiles)
            {
                Console.WriteLine($"Adding project: {Path.GetFileName(projectFile)}");
                await ExecuteCommand("dotnet", $"sln \"{solutionPath}\" add \"{projectFile}\"");
            }

            // create fetool.json file
            await FetHelper.CreateFetFile("Source", pascalCaseProjectName, pascalCaseProjectName, backendTargetPath);

            Console.WriteLine("Project creation completed successfully!");
        }
        catch (UserFriendlyException)
        {
            throw;
        }
        catch (Exception ex)
        {
            if (Directory.Exists(versionedTemplateDir) && !Directory.EnumerateFileSystemEntries(versionedTemplateDir).Any())
            {
                Directory.Delete(versionedTemplateDir, true);
            }
            throw new Exception($"Failed to generate project: {ex.Message}", ex);
        }
    }

    private async Task ExecuteCommand(string command, string arguments)
    {
        try
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

            if (command == "git" && !IsGitInstalled())
            {
                throw new Exception("Git is not installed or not accessible in the system PATH.");
            }

            process.Start();

            var timeoutTask = Task.Delay(TimeSpan.FromMinutes(5));
            var processTask = process.WaitForExitAsync();

            var output = await process.StandardOutput.ReadToEndAsync();
            var error = await process.StandardError.ReadToEndAsync();

            var completedTask = await Task.WhenAny(processTask, timeoutTask);
            if (completedTask == timeoutTask)
            {
                process.Kill();
                throw new Exception($"Command timed out after 5 minutes: {command} {arguments}");
            }

            if (process.ExitCode != 0)
                throw new Exception($"Command failed with exit code {process.ExitCode}:\nCommand: {command} {arguments}\nError: {error}\nOutput: {output}");
        }
        catch (Exception ex) when (ex is not InvalidOperationException)
        {
            throw new Exception($"Failed to execute command: {command} {arguments}\nError: {ex.Message}", ex);
        }
    }

    private bool IsGitInstalled()
    {
        try
        {
            using var process = Process.Start(new ProcessStartInfo
            {
                FileName = "git",
                Arguments = "--version",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            });
            return process?.WaitForExit(5000) == true && process.ExitCode == 0;
        }
        catch
        {
            return false;
        }
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
        foreach (string filePath in Directory.GetFiles(directory, "*", SearchOption.AllDirectories))
        {
            string newFilePath = filePath.Replace(oldValue, newValue);
            if (filePath != newFilePath)
                File.Move(filePath, newFilePath);
        }

        foreach (string dirPath in Directory.GetDirectories(directory, "*", SearchOption.AllDirectories)
                                          .OrderByDescending(d => d.Length))
        {
            string newDirPath = dirPath.Replace(oldValue, newValue);
            if (dirPath != newDirPath)
                Directory.Move(dirPath, newDirPath);
        }
    }

    private async Task ReplaceInFiles(string targetPath, string oldValue, string newValue)
    {
        foreach (string filePath in Directory.GetFiles(targetPath, "*.*", SearchOption.AllDirectories))
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

        // Update connection string in appsettings files
        var appsettingsFiles = Directory.GetFiles(targetPath, "appsettings*.json", SearchOption.AllDirectories);
        foreach (var file in appsettingsFiles)
        {
            var content = await File.ReadAllTextAsync(file);

            // Replace main database name
            content = content.Replace("Database=FastEndpoints", $"Database={newValue}");

            // Replace test database name
            content = content.Replace("Database=FastEndpointsTest", $"Database={newValue}Test");

            await File.WriteAllTextAsync(file, content);
        }
    }

    private void CopyFilesIfExists(string sourceDirectory, string targetDirectory, params string[] fileNames)
    {
        foreach (var fileName in fileNames)
        {
            var sourceFilePath = Path.Combine(sourceDirectory, fileName);
            var targetFilePath = Path.Combine(targetDirectory, fileName);

            if (File.Exists(sourceFilePath))
            {
                File.Copy(sourceFilePath, targetFilePath, overwrite: true);
            }
            else
            {
                throw new UserFriendlyException($"File '{fileName}' does not exist in the source directory '{sourceDirectory}'.");
            }
        }
    }
}
