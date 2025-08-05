using Backend.Attributes;
using NetArchTest.Rules;
using Xunit.Abstractions;

namespace Tests.Architect;

public class NoDirectUseTests(ITestOutputHelper OutputHelper)
{
    [Fact]
    public void ClassesWithNoDirectUseAttribute_ShouldNotBeUsedDirectly()
    {
        // Arrange
        var assembly = typeof(Program).Assembly;

        var typesWithNoDirectUseAttribute = Types.InAssembly(assembly)
            .That()
            .HaveCustomAttribute(typeof(NoDirectUseAttribute))
            .GetTypes()
            .Select(t => t.FullName)
            .ToArray();

        if (!typesWithNoDirectUseAttribute.Any())
        {
            // No types to test, so the test passes by default.
            return;
        }

        // Act
        var testResult = Types.InAssembly(assembly)
            .That()
            .DoNotHaveCustomAttribute(typeof(NoDirectUseAttribute))
            .ShouldNot()
            .HaveDependencyOnAny(typesWithNoDirectUseAttribute)
            .GetResult();

        // Assert
        Assert.True(testResult.IsSuccessful, GetFailingTypesMessage(testResult));
    }
    
    [Fact]
    public void ClassesWithNoDirectUseAttribute_ShouldBeUsedDirectly()
    {
        // Arrange
        var assembly = GetType().Assembly;

        var typesWithNoDirectUseAttribute = Types.InAssembly(assembly)
                                                 .That()
                                                 .HaveCustomAttribute(typeof(NoDirectUseAttribute))
                                                 .GetTypes()
                                                 .Select(t => t.FullName)
                                                 .ToArray();

        if (!typesWithNoDirectUseAttribute.Any())
        {
            // No types to test, so the test passes by default.
            return;
        }

        // Act
        var testResult = Types.InAssembly(assembly)
                              .That()
                              .DoNotHaveCustomAttribute(typeof(NoDirectUseAttribute))
                              .ShouldNot()
                              .HaveDependencyOnAny(typesWithNoDirectUseAttribute)
                              .GetResult();

        // Assert
        Assert.False(testResult.IsSuccessful);
        
        OutputHelper.WriteLine(GetFailingTypesMessage(testResult));
    }

    private static string GetFailingTypesMessage(TestResult result)
    {
        if (result.IsSuccessful)
        {
            return string.Empty;
        }

        var failingTypes = result.FailingTypes.Select(t => t.FullName);
        return $"The following types violate the NoDirectUse rule: {string.Join(", ", failingTypes)}";
    }
}