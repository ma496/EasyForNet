namespace FastEndpointsTool.Templates;

interface ITemplate<TArgument> 
    where TArgument : class
{
    string Template(TArgument arg);
}
