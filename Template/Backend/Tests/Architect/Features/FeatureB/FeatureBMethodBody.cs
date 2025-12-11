namespace Backend.Tests.Architect.Features.FeatureB;

using Backend.Tests.Architect.Features.FeatureA;

// ReSharper disable UnusedVariable


public class FeatureBMethodBody
{
    public void MethodA()
    {
        IFeatureAOneService featureAOneService = new FeatureAOneService();
        IFeatureAAllowOutsideService featureAAllowOutsideService = new FeatureAAllowOutsideService();
        featureAAllowOutsideService.MethodOne(new());
        var x = featureAAllowOutsideService.MethodTwo();
        featureAAllowOutsideService.MethodThree();
    }
}