using Tests.Architect.Features.FeatureA;
// ReSharper disable UnusedVariable

namespace Tests.Architect.Features.FeatureB;

public class FeatureBMethodBody
{
    public void MethodA()
    {
        IFeatureAOneService featureAOneService = new FeatureAOneService();
        IFeatureAAllowOutsideService featureAAllowOutsideService1 = new FeatureAAllowOutsideService();
        featureAAllowOutsideService1.MethodOne(new());
    }
}