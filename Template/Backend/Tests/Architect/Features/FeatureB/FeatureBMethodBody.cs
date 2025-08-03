using Tests.Architect.Features.FeatureA;
// ReSharper disable UnusedVariable

namespace Tests.Architect.Features.FeatureB;

public class FeatureBMethodBody
{
    public void MethodA()
    {
        IFeatureAOneService featureAOneService = new FeatureAOneService();
    }
}