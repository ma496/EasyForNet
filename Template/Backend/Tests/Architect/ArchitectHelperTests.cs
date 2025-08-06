using System.Diagnostics.CodeAnalysis;
using Mono.Cecil;
using Tests.Architect.Features.FeatureA;
using TypeDefinition = Mono.Cecil.TypeDefinition;

namespace Tests.Architect;

public class ArchitectHelperTests(App App) : AppTestsBase(App) 
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

    private void MustHaveDependencies(IReadOnlyList<TypeDefinition> dependencies, params Type[] mustHaveTypes)
    {
        var dependenciesFullName = dependencies.Select(x => x.FullName).ToList();
        foreach (var type in mustHaveTypes)
        {
            if (dependencies.All(x => x.FullName != type.FullName))
                Assert.Fail($"- Type '{type.FullName}' not found in dependencies\n{string.Join('\n', dependenciesFullName)}.");
        }
    }
    
    
    [SuppressMessage("ReSharper", "UnusedParameter.Local"),SuppressMessage("ReSharper", "UnusedMember.Local")]
    public abstract class ServiceOneBase
    {
        const string Name = "ServiceOne";
        protected ServiceOneBase(FeatureAOneService featureAOneService)
        {
            
        }
        
        protected int MultiplyBy3(int number)
            => number * 3;

        private static void MethodOne()
        {
        #pragma warning disable CS0219 // Variable is assigned but its value is never used
            var x = 33.4;
            var y = 53.43f;
        #pragma warning restore CS0219 // Variable is assigned but its value is never used
        }
    }
    
    [SuppressMessage("ReSharper", "UnusedParameter.Local")]
    public class ServiceOne : ServiceOneBase
    {
        public ServiceOne(IFeatureAOneService featureAOneService) : base(new())
        {
            
        }
    }
}