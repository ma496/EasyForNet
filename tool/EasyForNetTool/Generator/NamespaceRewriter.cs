namespace EasyForNetTool.Generator;

using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

/// <summary>
/// A Roslyn syntax rewriter that replaces occurrences of an old root namespace with a new one
/// in qualified names and identifier names within C# syntax trees.
/// </summary>
public class NamespaceRewriter(string oldRoot, string newRoot) : CSharpSyntaxRewriter
{
    private readonly string _old = oldRoot;
    private readonly string _new = newRoot;

    /// <summary>
    /// Replaces the old root namespace prefix with the new one if the string starts with the old root.
    /// </summary>
    private string ReplaceNs(string ns)
    {
        return ns.StartsWith(_old) ? ns.Replace(_old, _new) : ns;
    }

    /// <summary>
    /// Visits a qualified name node and rewrites it if it starts with the old root namespace.
    /// </summary>
    public override SyntaxNode? VisitQualifiedName(QualifiedNameSyntax node)
    {
        var full = node.ToString();
        if (full.StartsWith(_old))
            return SyntaxFactory.ParseName(ReplaceNs(full));

        return base.VisitQualifiedName(node);
    }

    /// <summary>
    /// Visits an identifier name node and rewrites it if it starts with the old root namespace.
    /// </summary>
    public override SyntaxNode? VisitIdentifierName(IdentifierNameSyntax node)
    {
        var text = node.ToString();
        if (text.StartsWith(_old))
            return SyntaxFactory.ParseName(ReplaceNs(text));

        return base.VisitIdentifierName(node);
    }
}