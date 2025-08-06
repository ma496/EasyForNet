using Tests.Architect.Features.FeatureA;
// ReSharper disable UnusedVariable

namespace Tests.Architect.Features.FeatureB;

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