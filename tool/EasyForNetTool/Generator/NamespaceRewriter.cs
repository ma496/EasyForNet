namespace EasyForNetTool.Generator;

using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

public class NamespaceRewriter(string oldRoot, string newRoot) : CSharpSyntaxRewriter
{
    private readonly string _old = oldRoot;
    private readonly string _new = newRoot;

    private string ReplaceNs(string ns)
    {
        return ns.StartsWith(_old) ? ns.Replace(_old, _new) : ns;
    }

    public override SyntaxNode? VisitQualifiedName(QualifiedNameSyntax node)
    {
        var full = node.ToString();
        if (full.StartsWith(_old))
            return SyntaxFactory.ParseName(ReplaceNs(full));

        return base.VisitQualifiedName(node);
    }

    public override SyntaxNode? VisitIdentifierName(IdentifierNameSyntax node)
    {
        var text = node.ToString();
        if (text.StartsWith(_old))
            return SyntaxFactory.ParseName(ReplaceNs(text));

        return base.VisitIdentifierName(node);
    }
}