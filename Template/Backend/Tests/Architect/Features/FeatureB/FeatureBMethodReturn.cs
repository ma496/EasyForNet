namespace Backend.Tests.Architect.Features.FeatureB;

using Backend.Tests.Architect.Features.FeatureA;

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