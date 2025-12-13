using EasyForNetTool;
using Xunit;

namespace EasyForNetTool.Tests;

public class HelpersTests : IDisposable
{
    private readonly string _testDirectory;

    public HelpersTests()
    {
        _testDirectory = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(_testDirectory);
    }

    public void Dispose()
    {
        if (Directory.Exists(_testDirectory))
            Directory.Delete(_testDirectory, true);
    }

    [Fact]
    public void GetProjectInfo_ReturnsNulls_WhenNoCsprojFound()
    {
        // Act
        var result = Helpers.GetProjectInfo(_testDirectory);

        // Assert
        Assert.Null(result.projectName);
        Assert.Null(result.rootNamespace);
    }

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
