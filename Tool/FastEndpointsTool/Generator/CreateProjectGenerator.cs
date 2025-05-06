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
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
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

                // Create a temporary directory for cloning
                var tempDir = Path.Combine(Path.GetTempPath(), $"FastEndpointsTool_Temp_{Guid.NewGuid()}");
                Directory.CreateDirectory(tempDir);

                try
                {
                    Console.WriteLine("Cloning template repository to temporary location...");
                    try
                    {
                        await ExecuteCommand("git", $"clone {gitUrl} \"{tempDir}\"");
                    }
                    catch (Exception ex)
                    {
                        throw new Exception($"Failed to clone template repository. Please ensure Git is installed and accessible. Error: {ex.Message}", ex);
                    }

                    Console.WriteLine($"Checking out version {version} in temporary location...");
                    try
                    {
                        await ExecuteCommand("git", $"-C \"{tempDir}\" checkout tags/v{version}");
                    }
                    catch (Exception ex)
                    {
                        throw new Exception($"Failed to checkout version {version}. The version might not exist. Error: {ex.Message}", ex);
                    }

                    // Remove git folder from temporary location
                    var gitFolder = Path.Combine(tempDir, ".git");
                    if (Directory.Exists(gitFolder))
                    {
                        try
                        {
                            Directory.Delete(gitFolder, true);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Warning: Could not remove .git folder: {ex.Message}");
                            // Continue even if this fails
                        }
                    }

                    // Create template directory and copy files from temp
                    Directory.CreateDirectory(templateBaseDir);

                    Console.WriteLine($"Moving template files from temporary location to {versionedTemplateDir}");
                    try
                    {
                        // If versionedTemplateDir doesn't exist, create it
                        if (!Directory.Exists(versionedTemplateDir))
                        {
                            Directory.CreateDirectory(versionedTemplateDir);
                        }

                        // Copy all template files from temp directory to final location
                        CopyDirectory(tempDir, versionedTemplateDir, true);
                    }
                    catch (Exception ex)
                    {
                        throw new Exception($"Failed to copy template files from temporary location: {ex.Message}", ex);
                    }
                }
                finally
                {
                    // Clean up temporary directory
                    try
                    {
                        if (Directory.Exists(tempDir))
                        {
                            Directory.Delete(tempDir, true);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Warning: Could not clean up temporary directory: {ex.Message}");
                        // Continue even if cleanup fails
                    }
                }
            }

            Console.WriteLine("Copying template files...");
            var backendProjectPath = Path.Combine(versionedTemplateDir, "Template", "Backend");
            var webProjectPath = Path.Combine(versionedTemplateDir, "Template", "Frontend", "fe-web");

            if (!Directory.Exists(backendProjectPath))
            {
                throw new UserFriendlyException($"Backend template path not found at '{backendProjectPath}'. Templates may be corrupted or incomplete.");
            }

            if (!Directory.Exists(webProjectPath))
            {
                throw new UserFriendlyException($"Frontend template path not found at '{webProjectPath}'. Templates may be corrupted or incomplete.");
            }

            var pascalCaseProjectName = argument.Name.ToPascalCase();
            var kebabCaseProjectName = argument.Name.ToKebabCase();
            var targetPath = Path.Combine(Directory.GetCurrentDirectory(), argument.Output ?? string.Empty, kebabCaseProjectName);
            var backendTargetPath = Path.Combine(targetPath, "src", "backend");
            var webTargetPath = Path.Combine(targetPath, "src", "frontend", "web");

            if (Directory.Exists(targetPath))
            {
                throw new UserFriendlyException($"Directory '{targetPath}' already exists. Please choose a different project name or location.");
            }

            Directory.CreateDirectory(targetPath);
            if (!Directory.Exists(backendTargetPath))
                Directory.CreateDirectory(backendTargetPath);
            if (!Directory.Exists(webTargetPath))
                Directory.CreateDirectory(webTargetPath);

            Console.WriteLine("Copying project files...");
            CopyDirectory(backendProjectPath, backendTargetPath, true);
            CopyDirectory(webProjectPath, webTargetPath, true);
            CopyFilesIfExists(versionedTemplateDir, targetPath, ".editorconfig", ".gitignore");

            Console.WriteLine("Customizing project files...");
            RenameFilesAndDirectories(backendTargetPath, "Backend", pascalCaseProjectName);
            await ReplaceInFiles(backendTargetPath, "Backend", pascalCaseProjectName);
            await ReplaceInFiles(webTargetPath, "fe-web", kebabCaseProjectName);

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
                try
                {
                    Directory.Delete(versionedTemplateDir, true);
                }
                catch
                {
                    // Ignore cleanup errors
                }
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
                try
                {
                    process.Kill();
                }
                catch
                {
                    // Ignore if process can't be killed (might have exited already)
                }
                throw new Exception($"Command timed out after 5 minutes: {command} {arguments}");
            }

            if (process.ExitCode != 0)
                throw new Exception($"Command failed with exit code {process.ExitCode}:\nCommand: {command} {arguments}\nError: {error}\nOutput: {output}");
        }
        catch (UnauthorizedAccessException ex)
        {
            throw new Exception($"Permission denied while executing command: {command} {arguments}. Error: {ex.Message}", ex);
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
        try
        {
            var dir = new DirectoryInfo(sourceDir);
            if (!dir.Exists)
            {
                throw new DirectoryNotFoundException($"Source directory not found: {sourceDir}");
            }

            DirectoryInfo[] dirs = dir.GetDirectories();

            // Create target directory if it doesn't exist
            Directory.CreateDirectory(targetDir);

            // Copy each file to target directory
            foreach (FileInfo file in dir.GetFiles())
            {
                try
                {
                    string targetFilePath = Path.Combine(targetDir, file.Name);
                    file.CopyTo(targetFilePath, overwrite: true);
                }
                catch (UnauthorizedAccessException ex)
                {
                    Console.WriteLine($"Warning: Permission denied when copying file {file.Name}: {ex.Message}");
                    // Continue with other files
                }
                catch (IOException ex)
                {
                    Console.WriteLine($"Warning: IO error when copying file {file.Name}: {ex.Message}");
                    // Continue with other files
                }
            }

            // Copy subdirectories if recursive is true
            if (recursive)
            {
                foreach (DirectoryInfo subDir in dirs)
                {
                    try
                    {
                        string newTargetDir = Path.Combine(targetDir, subDir.Name);
                        CopyDirectory(subDir.FullName, newTargetDir, true);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Warning: Error copying directory {subDir.Name}: {ex.Message}");
                        // Continue with other directories
                    }
                }
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Error copying directory {sourceDir} to {targetDir}: {ex.Message}", ex);
        }
    }

    private void RenameFilesAndDirectories(string directory, string oldValue, string newValue)
    {
        try
        {
            // First rename files
            foreach (string filePath in Directory.GetFiles(directory, "*", SearchOption.AllDirectories))
            {
                try
                {
                    string newFilePath = filePath.Replace(oldValue, newValue);
                    if (filePath != newFilePath)
                        File.Move(filePath, newFilePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Warning: Failed to rename file {filePath}: {ex.Message}");
                    // Continue with other files
                }
            }

            // Then rename directories (from deepest to shallowest)
            foreach (string dirPath in Directory.GetDirectories(directory, "*", SearchOption.AllDirectories)
                                          .OrderByDescending(d => d.Length))
            {
                try
                {
                    string newDirPath = dirPath.Replace(oldValue, newValue);
                    if (dirPath != newDirPath && Directory.Exists(dirPath))
                        Directory.Move(dirPath, newDirPath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Warning: Failed to rename directory {dirPath}: {ex.Message}");
                    // Continue with other directories
                }
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Error during renaming files and directories in {directory}: {ex.Message}", ex);
        }
    }

    private async Task ReplaceInFiles(string targetPath, string oldValue, string newValue)
    {
        try
        {
            foreach (string filePath in Directory.GetFiles(targetPath, "*.*", SearchOption.AllDirectories))
            {
                try
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
                catch (Exception ex)
                {
                    Console.WriteLine($"Warning: Failed to process file {filePath}: {ex.Message}");
                    // Continue with other files
                }
            }

            // Update connection string in appsettings files
            try
            {
                var appsettingsFiles = Directory.GetFiles(targetPath, "appsettings*.json", SearchOption.AllDirectories);
                foreach (var file in appsettingsFiles)
                {
                    try
                    {
                        var content = await File.ReadAllTextAsync(file);

                        // Replace main database name
                        content = content.Replace("Database=FastEndpoints", $"Database={newValue}");

                        // Replace test database name
                        content = content.Replace("Database=FastEndpointsTest", $"Database={newValue}Test");

                        await File.WriteAllTextAsync(file, content);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Warning: Failed to update connection string in {file}: {ex.Message}");
                        // Continue with other files
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Error processing appsettings files: {ex.Message}");
                // Continue execution
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Error replacing text in files in {targetPath}: {ex.Message}", ex);
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
                try
                {
                    File.Copy(sourceFilePath, targetFilePath, overwrite: true);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Warning: Could not copy {fileName}: {ex.Message}");
                    Console.WriteLine($"The file '{fileName}' might be missing in your project.");
                    // Continue rather than throw - this isn't critical enough to fail the entire operation
                }
            }
            else
            {
                Console.WriteLine($"Warning: File '{fileName}' does not exist in the source directory '{sourceDirectory}'.");
                // Don't throw an exception here, just log a warning
            }
        }
    }
}
