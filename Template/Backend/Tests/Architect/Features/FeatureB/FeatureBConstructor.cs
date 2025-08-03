using Tests.Architect.Features.FeatureA;
// ReSharper disable UnusedParameter.Local

namespace Tests.Architect.Features.FeatureB;

public class FeatureBConstructor
{
    public FeatureBConstructor(IFeatureAOneService featureAOneService, FeatureAOneService? featureAOneService1,
                               IFeatureAAllowOutsideService featureAAllowOutsideService,
                               FeatureAAllowOutsideService? featureAAllowOutsideService1)
    {
        
    }
}