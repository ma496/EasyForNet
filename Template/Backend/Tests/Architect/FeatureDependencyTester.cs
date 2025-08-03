using System.Reflection;
using Backend.Attributes;
using Mono.Cecil;
using NetArchTest.Rules;
using TypeDefinition = Mono.Cecil.TypeDefinition;

namespace Tests.Architect;

public record FeatureDependencyTestOutput(bool IsSuccess,
                                          string FeatureNamespace,
                                          IReadOnlyList<FailedTypeInfo> FailedTypes);

public record FailedTypeInfo(Type Type, IReadOnlyList<TypeDefinition> ForbiddenTypes);

public interface IFeatureDependencyTester
{
    FeatureDependencyTestOutput Test(Assembly assembly, string baseFeatureNamespace);
}

public class FeatureDependencyTester : IFeatureDependencyTester {
    public FeatureDependencyTestOutput Test(Assembly assembly, string baseFeatureNamespace)
    {
        var featureNamespaces = Types.InAssembly(assembly)
                                     .That().ResideInNamespaceStartingWith(baseFeatureNamespace)
                                     .GetTypes()
                                     .Select(t => GetFeatureFromNamespace(baseFeatureNamespace, t.Namespace ?? ""))
                                     .Where(n => !string.IsNullOrEmpty(n))
                                     .Distinct()
                                     .ToList();

        var isSuccessFlag = true;
        var featureNamespaceFlag = string.Empty;
        var failedTypesFlag = new List<FailedTypeInfo>();

        foreach (var featureNamespace in featureNamespaces)
        {
            var otherFeatureNamespaces = featureNamespaces.Where(n => n != featureNamespace).ToList();
            if (!otherFeatureNamespaces.Any())
            {
                continue;
            }

            var rule = new FeatureDependencyRule(otherFeatureNamespaces);

            var result = Types.InAssembly(assembly)
                              .That()
                              .ResideInNamespaceStartingWith(featureNamespace)
                              .Should()
                              .MeetCustomRule(rule)
                              .GetResult();

            if (result.IsSuccessful)
            {
                continue;
            }
            
            var assemblyDefinition = AssemblyDefinition.ReadAssembly(assembly.Location);

            var failedTypes = result.FailingTypes.Select<Type, FailedTypeInfo>(t =>
            {
                var typeDefinition = assemblyDefinition.MainModule.GetType(t.FullName);
                if (typeDefinition == null)
                {
                    return new(t, []);
                }

                var dependencies = ArchitectHelper.GetDependencies(typeDefinition);
                var forbidden = dependencies
                    .Where(d => otherFeatureNamespaces.Any(ns => d.FullName.StartsWith(ns)) &&
                                (!d.HasCustomAttributes ||
                                 d.CustomAttributes.All(a => a.AttributeType.FullName != typeof(AllowOutsideAttribute).FullName)))
                    .ToList();

                return new(t, forbidden);
            }).ToList();

            isSuccessFlag = false;
            featureNamespaceFlag = featureNamespace;
            failedTypesFlag = failedTypes;
            
            break;
        }
        
        return new(isSuccessFlag, featureNamespaceFlag, failedTypesFlag);
    }
    
    private static string GetFeatureFromNamespace(string baseFeatureNamespace, string @namespace)
    {
        if (string.IsNullOrEmpty(@namespace) || !@namespace.StartsWith($"{baseFeatureNamespace}."))
        {
            return string.Empty;
        }

        var parts = @namespace.Substring($"{baseFeatureNamespace}.".Length).Split('.');
        return $"{baseFeatureNamespace}.{parts.First()}";
    }
}