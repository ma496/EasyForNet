using Backend.Attributes;

namespace Tests.Architect.Features.FeatureA;

[AllowOutside]
public interface IFeatureAAllowOutsideService
{
}

[AllowOutside]
public class FeatureAAllowOutsideService : IFeatureAAllowOutsideService {
    
}