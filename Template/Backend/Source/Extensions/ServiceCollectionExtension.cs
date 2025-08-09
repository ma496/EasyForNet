using Backend.Base;

namespace Backend.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddFeatures(this IServiceCollection services)
    {
        // reflectionly call IFeature.AddServices static method
        var features = typeof(ServiceCollectionExtension).Assembly.GetTypes()
            .Where(p => typeof(IFeature).IsAssignableFrom(p) && !p.IsAbstract)
            .ToList();

        foreach (var feature in features)
        {
            feature.GetMethod("AddServices")?.Invoke(null, [services]);
        }
    }
}
