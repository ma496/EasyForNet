// ReSharper disable UnusedVariable
namespace Backend.Tests.Architect.Features.FeatureA;

public interface IFeatureAOneService
{
}

public class FeatureAOneService : IFeatureAOneService
{
    public FeatureAOneService()
    {
        var featureANoDirectUseService = new FeatureANoDirectUseService();
    }
} 