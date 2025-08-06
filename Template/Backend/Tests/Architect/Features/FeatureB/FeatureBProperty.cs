using Tests.Architect.Features.FeatureA;
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

namespace Tests.Architect.Features.FeatureB;

public class FeatureBProperty
{
    public IFeatureAOneService FeatureAOneService { get; set; }
    public FeatureAOneService FeatureAOneService1 { get; set; }
    public IFeatureAAllowOutsideService FeatureAAllowOutsideService { get; set; }
    public FeatureAAllowOutsideService? FeatureAAllowOutsideService1 { get; set; }
}