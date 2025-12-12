namespace Backend.Tests.Architect.Features.FeatureB;

using Backend.Tests.Architect.Features.FeatureA;

// ReSharper disable UnusedParameter.Local


public class FeatureBConstructor
{
    public FeatureBConstructor(IFeatureAOneService featureAOneService, FeatureAOneService? featureAOneService1,
                               IFeatureAAllowOutsideService featureAAllowOutsideService,
                               FeatureAAllowOutsideService? featureAAllowOutsideService1)
    {
        featureAAllowOutsideService.MethodOne(new());
    }
}