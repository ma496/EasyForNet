using Mono.Cecil;
using TypeDefinition = Mono.Cecil.TypeDefinition;

namespace Tests.Architect;

public static class ArchitectHelper
{
    public static IReadOnlyList<TypeDefinition> GetDependencies(TypeDefinition type)
    {
        var dependencies = new HashSet<TypeDefinition>();

        // Recursive local function to process types and their generic arguments.
        void AddDependenciesFrom(TypeReference typeRef)
        {
            // 1. Resolve the main type and add it as a dependency.
            //    e.g., for `List<string>`, this adds `System.List`.
            var resolvedType = typeRef.Resolve();
            if (resolvedType != null)
            {
                dependencies.Add(resolvedType);
            }

            // 2. If it's a generic type (like Tuple<T1, T2>), recursively process its arguments.
            if (typeRef is GenericInstanceType genericInstance)
            {
                foreach (var genericArg in genericInstance.GenericArguments)
                {
                    // This recursive call will handle nested generics,
                    // e.g., the inner tuple in `Tuple<T1, Tuple<T2, T3>>`.
                    AddDependenciesFrom(genericArg);
                }
            }
        }

        // --- Now, iterate through all type members using the helper ---

        // Base type
        AddDependenciesFrom(type.BaseType);

        // Interfaces
        if (type.HasInterfaces)
        {
            foreach (var i in type.Interfaces)
            {
                AddDependenciesFrom(i.InterfaceType);
            }
        }

        // Fields
        if (type.HasFields)
        {
            foreach (var field in type.Fields)
            {
                AddDependenciesFrom(field.FieldType);
            }
        }

        // Properties
        if (type.HasProperties)
        {
            foreach (var property in type.Properties)
            {
                AddDependenciesFrom(property.PropertyType);
            }
        }

        // Methods (including constructors)
        if (type.HasMethods)
        {
            foreach (var method in type.Methods)
            {
                // Return type
                AddDependenciesFrom(method.ReturnType);

                // Parameters
                foreach (var parameter in method.Parameters)
                {
                    AddDependenciesFrom(parameter.ParameterType);
                }

                // Method body locals and instructions
                if (method.HasBody)
                {
                    // Local variables
                    foreach(var variable in method.Body.Variables)
                    {
                        AddDependenciesFrom(variable.VariableType);
                    }

                    // Instruction operands
                    foreach (var instruction in method.Body.Instructions)
                    {
                        if (instruction.Operand is MethodReference methodReference)
                        {
                            AddDependenciesFrom(methodReference.DeclaringType);
                        }
                        else if (instruction.Operand is FieldReference fieldReference)
                        {
                            AddDependenciesFrom(fieldReference.DeclaringType);
                        }
                        else if (instruction.Operand is TypeReference typeReference)
                        {
                            AddDependenciesFrom(typeReference);
                        }
                    }
                }
            }
        }

        // Filter out the type itself and return the final list.
        return dependencies.Where(d => d != type).ToList();
    }
}