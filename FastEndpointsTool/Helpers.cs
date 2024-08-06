namespace FastEndpointsTool;

public static class Helpers
{
    public static IList<Argument> Arguments()
    {
        return new List<Argument>
        {
            new Argument
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
            new Argument
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
            new Argument
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
            new Argument
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
            new Argument
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
