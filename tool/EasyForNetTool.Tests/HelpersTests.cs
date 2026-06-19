namespace EasyForNetTool.Tests;

/// <summary>
/// Unit tests for the <see cref="Helpers"/> class, specifically the <see cref="Helpers.GetProjectInfo"/> method.
/// </summary>
public class HelpersTests : IDisposable
{
    private readonly string _testDirectory;

    /// <summary>
    /// Initializes a new test with a temporary directory.
    /// </summary>
    public HelpersTests()
    {
        _testDirectory = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(_testDirectory);
    }

    /// <summary>
    /// Cleans up the temporary test directory.
    /// </summary>
    public void Dispose()
    {
        if (Directory.Exists(_testDirectory))
            Directory.Delete(_testDirectory, true);
    }

    /// <summary>
    /// Tests that <see cref="Helpers.GetProjectInfo"/> returns null values when no .csproj file exists.
    /// </summary>
    [Fact]
    public void GetProjectInfo_ReturnsNulls_WhenNoCsprojFound()
    {
        // Act
        var result = Helpers.GetProjectInfo(_testDirectory);

        // Assert
        Assert.Null(result.projectName);
        Assert.Null(result.rootNamespace);
    }

    /// <summary>
    /// Tests that <see cref="Helpers.GetProjectInfo"/> uses the project name as root namespace when no RootNamespace tag exists.
    /// </summary>
    [Fact]
    public void GetProjectInfo_ReturnsCorrectInfo_WhenNoRootNamespaceTag()
    {
        // Arrange
        var csprojPath = Path.Combine(_testDirectory, "MyProject.csproj");
        File.WriteAllText(csprojPath, "<Project Sdk=\"Microsoft.NET.Sdk\"></Project>");

        // Act
        var result = Helpers.GetProjectInfo(_testDirectory);

        // Assert
        Assert.Equal("MyProject", result.projectName);
        Assert.Equal("MyProject", result.rootNamespace);
    }

    /// <summary>
    /// Tests that <see cref="Helpers.GetProjectInfo"/> correctly reads a multi-line RootNamespace tag.
    /// </summary>
    [Fact]
    public void GetProjectInfo_ReturnsCorrectInfo_WhenTagExists()
    {
        // Arrange
        var csprojPath = Path.Combine(_testDirectory, "MyProject.csproj");
        var content = @"
<Project Sdk=""Microsoft.NET.Sdk"">
  <PropertyGroup>
    <RootNamespace>Custom.Namespace</RootNamespace>
  </PropertyGroup>
</Project>";
        File.WriteAllText(csprojPath, content);

        // Act
        var result = Helpers.GetProjectInfo(_testDirectory);

        // Assert
        Assert.Equal("MyProject", result.projectName);
        Assert.Equal("Custom.Namespace", result.rootNamespace);
    }

    /// <summary>
    /// Tests that <see cref="Helpers.GetProjectInfo"/> correctly reads a single-line RootNamespace tag.
    /// </summary>
    [Fact]
    public void GetProjectInfo_ReturnsCorrectInfo_WhenTagExistsOneLine()
    {
        // Arrange
        var csprojPath = Path.Combine(_testDirectory, "MyProject.csproj");
        var content = @"<Project><RootNamespace>Custom.Namespace</RootNamespace></Project>";
        File.WriteAllText(csprojPath, content);

        // Act
        var result = Helpers.GetProjectInfo(_testDirectory);

        // Assert
        Assert.Equal("MyProject", result.projectName);
        Assert.Equal("Custom.Namespace", result.rootNamespace);
    }
}
