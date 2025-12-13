using EasyForNetTool.Extensions;

namespace EasyForNetTool.Tests.Extensions;

public class StringExtTests
{
    [Fact]
    public void ToCamelCase()
    {
        Assert.Equal("camelCase", "camelCase".ToCamelCase());
        Assert.Equal("camelCase", "CamelCase".ToCamelCase());
        Assert.Equal("camel-Case", "camel-Case".ToCamelCase());
        Assert.Equal("camel_Case", "camel_Case".ToCamelCase());
        Assert.Equal("camel Case", "camel Case".ToCamelCase());
    }

    [Fact]
    public void ToPascalCase()
    {
        Assert.Equal("PascalCase", "pascalCase".ToPascalCase());
        Assert.Equal("PascalCase", "PascalCase".ToPascalCase());
        Assert.Equal("Pascal-case", "pascal-case".ToPascalCase());
        Assert.Equal("Pascal_Case", "pascal_Case".ToPascalCase());
        Assert.Equal("Pascal Case", "pascal Case".ToPascalCase());
    }

    [Fact]
    public void ToKebabCase()
    {
        Assert.Equal("kebab-case", "kebab-case".ToKebabCase());
        Assert.Equal("kebab-case", "KebabCase".ToKebabCase());
        Assert.Equal("kebab-case", "kebabCase".ToKebabCase());
    }
}
