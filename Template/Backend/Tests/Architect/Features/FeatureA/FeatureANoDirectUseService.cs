namespace Backend.Tests.Architect.Features.FeatureA;

using Backend.Attributes;

public interface IFeatureANoDirectUseService
{
}

[NoDirectUse]
public class FeatureANoDirectUseService : IFeatureANoDirectUseService {
    
}