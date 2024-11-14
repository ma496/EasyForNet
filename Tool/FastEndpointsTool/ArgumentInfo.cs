using FastEndpointsTool.Parsing.Endpoint;

namespace FastEndpointsTool;


public class ArgumentInfo
{
    public Enum Type { get; init; } = null!;
    public string Name { get; init; } = null!;
    public string ShortName { get; init; } = null!;
    public string Description { get; init; } = null!;
    public IList<ArgumentOption> Options { get; init; } = null!;

    public static IList<ArgumentInfo> Arguments()
    {
        return new List<ArgumentInfo>
        {
            new ArgumentInfo
            {
                Type = EndpointType.Endpoint,
                Name = "endpoint",
                ShortName = "ep",
                Description = "Creaete endpoint with request, response, validator and mapper.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method.",
                        Required= true,
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint.",
                        Required= true,
                    },
                    new ArgumentOption
                    {
                        Name = "--entity",
                        ShortName = "-e",
                        Description = "Name of entity class.",
                        Required= true,
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint.",
                        Required = false,
                    },
                    new ArgumentOption
                    {
                        Name = "--group",
                        ShortName = "-g",
                        Description = "Endpoint group.",
                        Required = false,
                        NormalizeMethod = Helpers.GroupName,
                    }
                }
            },
            new ArgumentInfo
            {
                Type = EndpointType.EndpointWithoutMapper,
                Name = "endpointwithoutmapper",
                ShortName = "epwm",
                Description = "Creaete endpoint with request, response and validator.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint.",
                        Required = false,
                    },
                    new ArgumentOption
                    {
                        Name = "--group",
                        ShortName = "-g",
                        Description = "Endpoint group.",
                        Required = false,
                        NormalizeMethod = Helpers.GroupName,
                    }
                }
            },
            new ArgumentInfo
            {
                Type = EndpointType.EndpointWithoutResponse,
                Name = "endpointwithoutresponse",
                ShortName = "epwr",
                Description = "Creaete endpoint with request and validator.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes.",
                        Required= true,
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint.",
                        Required = false,
                    },
                    new ArgumentOption
                    {
                        Name = "--group",
                        ShortName = "-g",
                        Description = "Endpoint group.",
                        Required = false,
                        NormalizeMethod = Helpers.GroupName,
                    }
                }
            },
            new ArgumentInfo
            {
                Type = EndpointType.EndpointWithoutRequest,
                Name = "endpointwithoutrequest",
                ShortName = "epwreq",
                Description = "Creaete endpoint with response.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint.",
                        Required = false,
                    },
                    new ArgumentOption
                    {
                        Name = "--group",
                        ShortName = "-g",
                        Description = "Endpoint group.",
                        Required = false,
                        NormalizeMethod = Helpers.GroupName,
                    }
                }
            },
            new ArgumentInfo
            {
                Type = EndpointType.EndpointWithoutResponseAndRequest,
                Name = "endpointwithoutresponseandrequest",
                ShortName = "epwrreq",
                Description = "Creaete endpoint.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint.",
                        Required = false,
                    },
                    new ArgumentOption
                    {
                        Name = "--group",
                        ShortName = "-g",
                        Description = "Endpoint group.",
                        Required = false,
                        NormalizeMethod = Helpers.GroupName,
                    }
                },
            },
            new ArgumentInfo
            {
                Type = EndpointType.CreateEndpoint,
                Name = "createendpoint",
                ShortName = "cep",
                Description = "Creaete endpoint with request, response, validator and mapper.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--pluralName",
                        ShortName = "-pn",
                        Description = "Plural name of the entity for CRUD operations.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method.",
                        Required = true,
                        Default = "post",
                        IsInternal = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--entity",
                        ShortName = "-e",
                        Description = "Name of entity class.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint.",
                        Required = false,
                    },
                    new ArgumentOption
                    {
                        Name = "--group",
                        ShortName = "-g",
                        Description = "Endpoint group.",
                        Required = false,
                        NormalizeMethod = Helpers.GroupName,
                    },
                    new ArgumentOption
                    {
                        Name = "--dataContext",
                        ShortName = "-dc",
                        Description = "DataContext class name.",
                        Required = false
                    }
                }
            },
            new ArgumentInfo
            {
                Type = EndpointType.UpdateEndpoint,
                Name = "updateendpoint",
                ShortName = "uep",
                Description = "Update endpoint with request, response, validator and mapper.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--pluralName",
                        ShortName = "-pn",
                        Description = "Plural name of the entity for CRUD operations.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method.",
                        Required = true,
                        Default = "put",
                        IsInternal = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--entity",
                        ShortName = "-e",
                        Description = "Name of entity class.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint.",
                        Required = false,
                    },
                    new ArgumentOption
                    {
                        Name = "--group",
                        ShortName = "-g",
                        Description = "Endpoint group.",
                        Required = false,
                        NormalizeMethod = Helpers.GroupName,
                    },
                    new ArgumentOption
                    {
                        Name = "--dataContext",
                        ShortName = "-dc",
                        Description = "DataContext class name.",
                        Required = false
                    }
                }
            },
            new ArgumentInfo
            {
                Type = EndpointType.GetEndpoint,
                Name = "getendpoint",
                ShortName = "gep",
                Description = "Get endpoint with request, response, validator and mapper.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--pluralName",
                        ShortName = "-pn",
                        Description = "Plural name of the entity for CRUD operations.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method.",
                        Required = true,
                        Default = "get",
                        IsInternal = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--entity",
                        ShortName = "-e",
                        Description = "Name of entity class.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint.",
                        Required = false,
                    },
                    new ArgumentOption
                    {
                        Name = "--group",
                        ShortName = "-g",
                        Description = "Endpoint group.",
                        Required = false,
                        NormalizeMethod = Helpers.GroupName,
                    },
                    new ArgumentOption
                    {
                        Name = "--dataContext",
                        ShortName = "-dc",
                        Description = "DataContext class name.",
                        Required = false
                    },
                    new ArgumentOption
                    {
                        Name = "--baseProperties",
                        ShortName = "-bp",
                        Description = "Base properties.",
                        IsInternal = true,
                        Required = true,
                        Default = "true"
                    }
                }
            },
            new ArgumentInfo
            {
                Type = EndpointType.ListEndpoint,
                Name = "listendpoint",
                ShortName = "lep",
                Description = "Create list endpoint with request, response, validator and mapper.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--pluralName",
                        ShortName = "-pn",
                        Description = "Plural name of the entity for CRUD operations.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method.",
                        Required = true,
                        Default = "get",
                        IsInternal = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--entity",
                        ShortName = "-e",
                        Description = "Name of entity class.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint.",
                        Required = false,
                    },
                    new ArgumentOption
                    {
                        Name = "--group",
                        ShortName = "-g",
                        Description = "Endpoint group.",
                        Required = false,
                        NormalizeMethod = Helpers.GroupName,
                    },
                    new ArgumentOption
                    {
                        Name = "--dataContext",
                        ShortName = "-dc",
                        Description = "DataContext class name.",
                        Required = false
                    },
                    new ArgumentOption
                    {
                        Name = "--baseProperties",
                        ShortName = "-bp",
                        Description = "Base properties.",
                        IsInternal = true,
                        Required = true,
                        Default = "true"
                    }
                }
            },
            new ArgumentInfo
            {
                Type = EndpointType.DeleteEndpoint,
                Name = "deleteendpoint",
                ShortName = "dep",
                Description = "Create delete endpoint with request, response, and validator.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--pluralName",
                        ShortName = "-pn",
                        Description = "Plural name of the entity for CRUD operations.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method.",
                        Required = true,
                        Default = "delete",
                        IsInternal = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--entity",
                        ShortName = "-e",
                        Description = "Name of entity class.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint.",
                        Required = false,
                    },
                    new ArgumentOption
                    {
                        Name = "--group",
                        ShortName = "-g",
                        Description = "Endpoint group.",
                        Required = false,
                        NormalizeMethod = Helpers.GroupName,
                    },
                    new ArgumentOption
                    {
                        Name = "--dataContext",
                        ShortName = "-dc",
                        Description = "DataContext class name.",
                        Required = false
                    }
                }
            },
            new ArgumentInfo
            {
                Type = EndpointType.CrudEndpoint,
                Name = "crudendpoint",
                ShortName = "crud",
                Description = "Create CRUD endpoints (Create, Read, Update, Delete, List) for an entity.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of the entity for CRUD operations.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--pluralName",
                        ShortName = "-pn",
                        Description = "Plural name of the entity for CRUD operations.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--entity",
                        ShortName = "-e",
                        Description = "Name of entity class.",
                        Required = true,
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoints.",
                        Required = false,
                    },
                    new ArgumentOption
                    {
                        Name = "--dataContext",
                        ShortName = "-dc",
                        Description = "DataContext class name.",
                        Required = false
                    }
                }
            }
        };
    }
}

public class ArgumentOption
{
    public string Name { get; init; } = null!;
    public string ShortName { get; init; } = null!;
    public string Description { get; init; } = null!;
    public bool Required { get; init; }
    public string Default { get; set; } = null!;
    public bool IsInternal { get; set; }
    public Func<string, string>? NormalizeMethod { get; set; } = null!;
}
