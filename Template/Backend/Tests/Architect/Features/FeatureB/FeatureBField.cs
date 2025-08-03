using Tests.Architect.Features.FeatureA;
#pragma warning disable CS0169 // Field is never used
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

namespace Tests.Architect.Features.FeatureB;

public class FeatureBField
{
    private IFeatureAOneService _featureAOneService;
    private FeatureAOneService? _featureAOneService1;
    private IFeatureAAllowOutsideService _featureAAllowOutsideService;
    private FeatureAAllowOutsideService? _featureAAllowOutsideService1;
}