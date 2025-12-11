using Backend.Attributes;
using NetArchTest.Rules;

namespace Backend.Tests.Architect
{
    public class FeatureDependencyRule(IEnumerable<string> otherFeatureNamespaces) : ICustomRule
    {
        public bool MeetsRule(Mono.Cecil.TypeDefinition type)
        {
            if (type.IsInterface || type is { IsAbstract: true, IsSealed: false })
            {
                return true;
            }

            var dependencies = ArchitectHelper.GetDependencies(type);

            foreach (var dependency in dependencies)
            {
                if (otherFeatureNamespaces.Any(ns => dependency.FullName.StartsWith(ns)))
                {
                    if (!dependency.HasCustomAttributes || dependency.CustomAttributes.All(a => a.AttributeType.FullName != typeof(AllowOutsideAttribute).FullName))
                    {
                        return false; // Found a forbidden dependency
                    }
                }
            }

            return true; // No forbidden dependencies found
        }
    }
}
