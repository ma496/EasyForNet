using Tests.Architect.Features.FeatureA;

namespace Tests.Architect.Features.FeatureB;

public class FeatureBMethodReturn
{
    public IFeatureAOneService? MethodA()
    {
        return null;
    }
    
    public List<FeatureAOneService>? MethodB()
    {
        return null;
    }
}