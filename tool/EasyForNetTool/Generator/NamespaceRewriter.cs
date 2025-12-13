using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace EasyForNetTool.Generator;

public class NamespaceRewriter : CSharpSyntaxRewriter
{
    private readonly string _old;
    private readonly string _new;

    public NamespaceRewriter(string oldRoot, string newRoot)
    {
        _old = oldRoot;
        _new = newRoot;
    }

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