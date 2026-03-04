namespace Backend.Tests.Architect;

using System.Diagnostics.CodeAnalysis;
using Backend.Tests.Architect.Features.FeatureA;
using Mono.Cecil;
using TypeDefinition = Mono.Cecil.TypeDefinition;

public class ArchitectHelperTests(App app) : AppTestsBase(app) 
{
    [Fact]
    public void GetDependencies()
    {
        var assembly = GetType().Assembly;
        var assemblyDefinition = AssemblyDefinition.ReadAssembly(assembly.Location);
        var type = typeof(ServiceOne);
        var cecilTypeName = type.FullName?.Replace('+', '/') ?? string.Empty;
        var typeDefinition = assemblyDefinition.MainModule.GetType(cecilTypeName);
        
        Assert.NotNull(typeDefinition);
        
        var dependencies = ArchitectHelper.GetDependencies(typeDefinition);
        
        Assert.NotNull(dependencies);
        MustHaveDependencies(dependencies, 
            typeof(IFeatureAOneService), typeof(FeatureAOneService),
            typeof(int), typeof(string), typeof(double), typeof(float)
            );
    }

    private static void MustHaveDependencies(IReadOnlyList<TypeDefinition> dependencies, params Type[] mustHaveTypes)
    {
        var dependenciesFullName = dependencies.Select(x => x.FullName).ToList();
        foreach (var type in mustHaveTypes)
        {
            if (dependencies.All(x => x.FullName != type.FullName))
                Assert.Fail($"- Type '{type.FullName}' not found in dependencies\n{string.Join('\n', dependenciesFullName)}.");
        }
    }
    
    
    #pragma warning disable CS9113
    [SuppressMessage("ReSharper", "UnusedParameter.Local"),SuppressMessage("ReSharper", "UnusedMember.Local")]
    public abstract class ServiceOneBase(FeatureAOneService featureAOneService)
    {
        const string Name = "ServiceOne";

        protected static int MultiplyBy3(int number)
            => number * 3;

        private static void MethodOne()
        {
        #pragma warning disable CS0219 // Variable is assigned but its value is never used
            var x = 33.4;
            var y = 53.43f;
        #pragma warning restore CS0219 // Variable is assigned but its value is never used
        }
    }
    #pragma warning restore CS9113
    
    #pragma warning disable CS9113
    public class ServiceOne(IFeatureAOneService _) : ServiceOneBase(new())
    {
    }
    #pragma warning restore CS9113
}