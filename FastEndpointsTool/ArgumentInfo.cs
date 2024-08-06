namespace FastEndpointsTool;

public class ArgumentInfo
{
    public string Name { get; set; } = null!;
    public string ShortName { get; set; } = null!;
    public string Description { get; set; } = null!;
    public IList<ArgumentOption> Options { get; set; } = null!;

    public static IList<ArgumentInfo> Arguments()
    {
        return new List<ArgumentInfo>
        {
            new ArgumentInfo
            {
                Name = "endpoint",
                ShortName = "ep",
                Description = "Creaete endpoint with request, response, validator and mapper.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes."
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method."
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint."
                    },
                    new ArgumentOption
                    {
                        Name = "--entity",
                        ShortName = "-e",
                        Description = "Name of entity class."
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint."
                    }
                }
            },
            new ArgumentInfo
            {
                Name = "endpointwithoutmapper",
                ShortName = "epwm",
                Description = "Creaete endpoint with request, response and validator.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes."
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method."
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint."
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint."
                    }
                }
            },
            new ArgumentInfo
            {
                Name = "endpointwithoutresponse",
                ShortName = "epwr",
                Description = "Creaete endpoint with request and validator.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes."
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method."
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint."
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint."
                    }
                }
            },
            new ArgumentInfo
            {
                Name = "endpointwithoutrequest",
                ShortName = "epwreq",
                Description = "Creaete endpoint with response.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes."
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method."
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint."
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint."
                    }
                }
            },
            new ArgumentInfo
            {
                Name = "endpointwithoutresponseandrequest",
                ShortName = "epwrreq",
                Description = "Creaete endpoint.",
                Options = new List<ArgumentOption>
                {
                    new ArgumentOption
                    {
                        Name = "--name",
                        ShortName = "-n",
                        Description = "Name of endpoint classes."
                    },
                    new ArgumentOption
                    {
                        Name = "--method",
                        ShortName = "-m",
                        Description = "Http method."
                    },
                    new ArgumentOption
                    {
                        Name = "--url",
                        ShortName = "-u",
                        Description = "Url of endpoint."
                    },
                    new ArgumentOption
                    {
                        Name = "--output",
                        ShortName = "-o",
                        Description = "Path of endpoint."
                    }
                }
            }
        };
    }
}

public class ArgumentOption
{
    public string Name { get; set; } = null!;
    public string ShortName { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Value { get; set; } = null!;
    public string Output { get; set; } = null !;
}
