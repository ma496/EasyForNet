using Backend.Attributes;
using Mono.Cecil;
using NetArchTest.Rules;
using Xunit.Abstractions;

namespace Tests.Architect;

public class NoDirectUseTests(ITestOutputHelper output)
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
            .ToList();

        var typesWithNoDirectUseAttributeFullNames = typesWithNoDirectUseAttribute
                                                     .Select(x => x.FullName)
                                                     .ToArray();

        if (typesWithNoDirectUseAttribute.Count == 0)
        {
            // No types to test, so the test passes by default.
            return;
        }

        // Act
        var testResult = Types.InAssembly(assembly)
            .That()
            .DoNotHaveCustomAttribute(typeof(NoDirectUseAttribute))
            .And()
            .DoNotHaveCustomAttribute(typeof(BypassNoDirectUseAttribute))
            .And()
            .DoNotHaveName("Program")
            .ShouldNot()
            .HaveDependencyOnAny(typesWithNoDirectUseAttributeFullNames)
            .GetResult();

        // Assert
        Assert.True(testResult.IsSuccessful, GetFailingTypesMessage(testResult, typesWithNoDirectUseAttribute));
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
                                                 .ToList();

        var typesWithNoDirectUseAttributeFullNames = typesWithNoDirectUseAttribute
                                                     .Select(x => x.FullName)
                                                     .ToArray();

        if (typesWithNoDirectUseAttribute.Count == 0)
        {
            // No types to test, so the test passes by default.
            return;
        }

        // Act
        var testResult = Types.InAssembly(assembly)
                              .That()
                              .DoNotHaveCustomAttribute(typeof(NoDirectUseAttribute))
                              .And()
                              .DoNotHaveCustomAttribute(typeof(BypassNoDirectUseAttribute))
                              .And()
                              .DoNotHaveName("Program")
                              .ShouldNot()
                              .HaveDependencyOnAny(typesWithNoDirectUseAttributeFullNames)
                              .GetResult();

        // Assert
        Assert.False(testResult.IsSuccessful);
        
        output.WriteLine(GetFailingTypesMessage(testResult, typesWithNoDirectUseAttribute));
    }

    private static string GetFailingTypesMessage(TestResult result, IReadOnlyList<Type> typesWithNoDirectUseAttribute)
    {
        if (result.IsSuccessful || result.FailingTypes == null)
        {
            return string.Empty;
        }

        var failingTypesDetails = result.FailingTypes.Select(failingType =>
        {
            var module = ModuleDefinition.ReadModule(failingType.Module.FullyQualifiedName);
            var cecilType = module.GetType(failingType.FullName);

            if (cecilType == null) return $"{failingType.FullName} (could not analyze dependencies)";

            var dependencies = ArchitectHelper.GetDependencies(cecilType);
            var forbiddenDependencies = dependencies
                .Where(dep => typesWithNoDirectUseAttribute.Any(t => t.FullName == dep.FullName))
                .Select(d => d.FullName)
                .ToList();

            if (forbiddenDependencies.Count != 0)
            {
                return $"{failingType.FullName} -> [{string.Join(", ", forbiddenDependencies)}]";
            }

            return $"{failingType.FullName} (unexpected dependency)";
        });

        return $"The following types violate the NoDirectUse rule (Type -> Forbidden Dependencies):\n- {string.Join("\n- ", failingTypesDetails)}";
    }
}