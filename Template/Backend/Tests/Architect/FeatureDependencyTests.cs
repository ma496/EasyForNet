using Tests.Architect.Features.FeatureA;
using Tests.Architect.Features.FeatureB;
using Tests.Architect.Features.FeatureB.Stat;
using Xunit.Abstractions;

namespace Tests.Architect;

public class FeatureDependencyTests(App App, ITestOutputHelper TestOutputHelper) : AppTestsBase(App)
{
    [Fact]
    public void Features_Should_Not_Have_Unwanted_Dependencies()
    {
      var assembly = typeof(Program).Assembly;
      const string baseFeatureNamespace = "Backend.Features";
      var featureDependencyTester = App.Services.GetRequiredService<IFeatureDependencyTester>();
      var testOutput = featureDependencyTester.Test(assembly, baseFeatureNamespace);
      
      Assert.True(testOutput.IsSuccess, FormatFailureMessage(testOutput));
    }
    
    [Fact]
    public void Features_Should_Have_Unwanted_Dependencies()
    {
        var assembly = GetType().Assembly;
        const string baseFeatureNamespace = "Tests.Architect.Features";
        var featureDependencyTester = App.Services.GetRequiredService<IFeatureDependencyTester>();
        var testOutput = featureDependencyTester.Test(assembly, baseFeatureNamespace);
      
        Assert.False(testOutput.IsSuccess);
        TestOutputHelper.WriteLine(FormatFailureMessage(testOutput));
        
        MustHaveForbiddenTypes(testOutput, typeof(FeatureBStat), 
            [typeof(IFeatureAOneService)]);
        MustHaveForbiddenTypes(testOutput, typeof(FeatureBConstructor), 
            [typeof(IFeatureAOneService), typeof(FeatureAOneService)]);
        MustHaveForbiddenTypes(testOutput, typeof(FeatureBConstructorBody), 
            [typeof(IFeatureAOneService), typeof(FeatureAOneService)]);
        MustHaveForbiddenTypes(testOutput, typeof(FeatureBField), 
            [typeof(IFeatureAOneService), typeof(FeatureAOneService)]);
        MustHaveForbiddenTypes(testOutput, typeof(FeatureBProperty), 
            [typeof(IFeatureAOneService), typeof(FeatureAOneService)]);
        MustHaveForbiddenTypes(testOutput, typeof(FeatureBPropertyGet), 
            [typeof(IFeatureAOneService), typeof(FeatureAOneService)]);
        MustHaveForbiddenTypes(testOutput, typeof(FeatureBPropertyGetExpression), 
            [typeof(IFeatureAOneService), typeof(FeatureAOneService)]);
        MustHaveForbiddenTypes(testOutput, typeof(FeatureBPropertySet), 
            [typeof(IFeatureAOneService), typeof(FeatureAOneService)]);
        MustHaveForbiddenTypes(testOutput, typeof(FeatureBMethodParameters), 
            [typeof(IFeatureAOneService), typeof(FeatureAOneService)]);
        MustHaveForbiddenTypes(testOutput, typeof(FeatureBMethodReturn), 
            [typeof(IFeatureAOneService), typeof(FeatureAOneService)]);
        MustHaveForbiddenTypes(testOutput, typeof(FeatureBMethodReturnTuple), 
            [typeof(IFeatureAOneService), typeof(FeatureAOneService)]);
        MustHaveForbiddenTypes(testOutput, typeof(FeatureBMethodBody), 
            [typeof(IFeatureAOneService), typeof(FeatureAOneService)]);
    }
  
    private static string FormatFailureMessage(FeatureDependencyTestOutput testOutput)
    {
        if (testOutput.IsSuccess)
        {
            return string.Empty;
        }
  
        var failedTypesMessages = testOutput.FailedTypes.Select(ft =>
        {
            if (!ft.ForbiddenTypes.Any())
            {
                return $"- Type '{ft.Type.FullName}' failed, but no specific forbidden dependencies were found. Check for base class or interface issues.";
            }
            
            var forbiddenTypeFullNames = ft.ForbiddenTypes.Select(ft1 => ft1.FullName).ToList();
  
            return $@"- Type '{ft.Type.FullName}' in feature '{testOutput.FeatureNamespace}' has forbidden dependencies on:
  - {string.Join("\n  - ", forbiddenTypeFullNames)}";
        });
  
        return "Feature dependency test failed:\n" + string.Join("\n", failedTypesMessages);
    }

    private static void MustHaveForbiddenTypes(FeatureDependencyTestOutput testOutput,
                                               Type type,
                                               Type[] forbiddenTypes)
    {
        var failedType = testOutput.FailedTypes.SingleOrDefault(ft => ft.Type.FullName == type.FullName);

        if (failedType == null)
            Assert.Fail($"No failed type '{type.FullName}' found.");

        foreach (var forbiddenType in forbiddenTypes)
        {
            if (failedType.ForbiddenTypes.All(x => x.FullName != forbiddenType.FullName))
                Assert.Fail($"No forbidden type '{forbiddenType.FullName}' found under '{type.FullName}'.");
        }
    }
}
