using Backend.Attributes;
using Mono.Cecil;
using NetArchTest.Rules;

namespace Tests.Architect
{
    public class FeatureDependencyRule(IEnumerable<string> otherFeatureNamespaces) : ICustomRule
    {
        public bool MeetsRule(Mono.Cecil.TypeDefinition type)
        {
            if (type.IsInterface || type is { IsAbstract: true, IsSealed: false })
            {
                return true;
            }

            var dependencies = GetDependencies(type);

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

        public static IEnumerable<Mono.Cecil.TypeDefinition> GetDependencies(Mono.Cecil.TypeDefinition type)
        {
            var dependencies = new HashSet<Mono.Cecil.TypeDefinition>();

            // Fields
            if (type.HasFields)
            {
                foreach (var field in type.Fields)
                {
                    var dependency = field.FieldType.Resolve();
                    if (dependency != null) dependencies.Add(dependency);
                }
            }

            // Properties
            if (type.HasProperties)
            {
                foreach (var property in type.Properties)
                {
                    var dependency = property.PropertyType.Resolve();
                    if (dependency != null) dependencies.Add(dependency);
                }
            }

            // Methods (including constructors)
            if (type.HasMethods)
            {
                foreach (var method in type.Methods)
                {
                    // Return type
                    var returnType = method.ReturnType.Resolve();
                    if (returnType != null) dependencies.Add(returnType);

                    // Parameters
                    foreach (var parameter in method.Parameters)
                    {
                        var parameterType = parameter.ParameterType.Resolve();
                        if (parameterType != null) dependencies.Add(parameterType);
                    }

                    // Method body
                    if (method.HasBody)
                    {
                        foreach (var instruction in method.Body.Instructions)
                        {
                            if (instruction.Operand is MethodReference methodReference)
                            {
                                var dependency = methodReference.DeclaringType.Resolve();
                                if (dependency != null) dependencies.Add(dependency);
                            }
                            else if (instruction.Operand is FieldReference fieldReference)
                            {
                                var dependency = fieldReference.DeclaringType.Resolve();
                                if (dependency != null) dependencies.Add(dependency);
                            }
                        }
                    }
                }
            }

            // Base type
            if (type.BaseType != null)
            {
                var baseType = type.BaseType.Resolve();
                if (baseType != null) dependencies.Add(baseType);
            }

            // Interfaces
            if (type.HasInterfaces)
            {
                foreach (var i in type.Interfaces)
                {
                    var interfaceType = i.InterfaceType.Resolve();
                    if (interfaceType != null) dependencies.Add(interfaceType);
                }
            }

            return dependencies.Where(d => d != type).Distinct();
        }
    }
}
