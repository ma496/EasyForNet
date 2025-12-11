namespace Backend.Tests.Architect.Features.FeatureB;

using Backend.Tests.Architect.Features.FeatureA;

// ReSharper disable UnusedVariable


public class FeatureBConstructorBody
{
    public FeatureBConstructorBody()
    {
        IFeatureAOneService featureAOneService = new FeatureAOneService();
        var featureAOneService1 = new FeatureAOneService();
        IFeatureAAllowOutsideService featureAAllowOutsideService = new FeatureAAllowOutsideService();
        var featureAAllowOutsideService1 = new FeatureAAllowOutsideService();
    }
}