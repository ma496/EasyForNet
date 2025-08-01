namespace Tests.Architect;

public class FeatureDependencyTests(App App) : AppTestsBase(App)
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
}
