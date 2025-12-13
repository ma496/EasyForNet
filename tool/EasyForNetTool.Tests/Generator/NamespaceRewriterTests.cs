using EasyForNetTool.Generator;
using Microsoft.CodeAnalysis.CSharp;

namespace EasyForNetTool.Tests.Generator;

public class NamespaceRewriterTests
{
    [Fact]
    public void Should_Rewrite_Namespace_Declaration_And_Using_Statements()
    {
        // Arrange
        // Use single-part root to ensure IdentifierName visitor triggers on the first token in expressions
        var oldNs = "Old";
        var newNs = "New";
        var sourceCode = @"
using Old.Namespace.Helper;
using System;

namespace Old.Namespace.MyFeature;

public class MyClass
{
    public void Method()
    {
        var Old = ""Old"";
        Old.Namespace.Helper.DoSomething();
    }
}
";

        var rewriter = new NamespaceRewriter(oldNs, newNs);
        var tree = CSharpSyntaxTree.ParseText(sourceCode);
        var root = tree.GetRoot();

        // Act
        var result = rewriter.Visit(root);
        var resultCode = result.ToFullString();

        // Assert
        // Namespace declaration SHOULD change
        Assert.Contains("namespace New.Namespace.MyFeature;", resultCode);

        // Using statement SHOULD change
        Assert.Contains("using New.Namespace.Helper;", resultCode);

        // Code body SHOULD change
        Assert.Contains("New.Namespace.Helper.DoSomething();", resultCode);

        // Old variable name SHOULD NOT change
        Assert.Contains("var Old = \"Old\";", resultCode);
    }
}
