using Backend.Attributes;

namespace Tests.Architect.Features.FeatureA;

public interface IFeatureANoDirectUseService
{
}

[NoDirectUse]
public class FeatureANoDirectUseService : IFeatureANoDirectUseService {
    
}