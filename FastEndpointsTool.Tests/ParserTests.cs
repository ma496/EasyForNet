using FastEndpointsTool.Parsing;
using FastEndpointsTool.Parsing.Endpoint;
using Xunit.Abstractions;

namespace FastEndpointsTool.Tests;

public class ParserTests
{
    private readonly ITestOutputHelper _outputHelper;

    public ParserTests(ITestOutputHelper outputHelper)
    {
        _outputHelper = outputHelper;
    }

    #region Success Cases

    [Fact]
    public void EndpointTest()
    {
        var args = new[] { "endpoint", "--name", "GetUsers", "--method", "post", "--url", "get-users", "--entity", "User" };
        var parser = new Parser();

        var result = parser.Parse(args);

        Assert.IsType<EndpointArgument>(result);

        var endpointArgument = result as EndpointArgument;

        Assert.NotNull(endpointArgument);
        Assert.Equal(EndpointType.Endpoint, endpointArgument.Type);
        Assert.Equal("GetUsers", endpointArgument.Name);
        Assert.Equal("post", endpointArgument.Method);
        Assert.Equal("get-users", endpointArgument.Url);
        Assert.Equal("User", endpointArgument.Entity);
    }

    [Fact]
    public void EpTest()
    {
        var args = new[] { "ep", "-n", "GetUsers", "-m", "post", "-u", "get-users", "-e", "User" };
        var parser = new Parser();

        var result = parser.Parse(args);

        Assert.IsType<EndpointArgument>(result);

        var endpointArgument = result as EndpointArgument;

        Assert.NotNull(endpointArgument);
        Assert.Equal(EndpointType.Endpoint, endpointArgument.Type);
        Assert.Equal("GetUsers", endpointArgument.Name);
        Assert.Equal("post", endpointArgument.Method);
        Assert.Equal("get-users", endpointArgument.Url);
        Assert.Equal("User", endpointArgument.Entity);
    }

    [Fact]
    public void EndpointWithoutMapperTest()
    {
        var args = new[] { "endpointwithoutmapper", "--name", "GetUsers", "--method", "post", "--url", "get-users" };
        var parser = new Parser();

        var result = parser.Parse(args);

        Assert.IsType<EndpointArgument>(result);

        var endpointArgument = result as EndpointArgument;

        Assert.NotNull(endpointArgument);
        Assert.Equal(EndpointType.EndpointWithoutMapper, endpointArgument.Type);
        Assert.Equal("GetUsers", endpointArgument.Name);
        Assert.Equal("post", endpointArgument.Method);
        Assert.Equal("get-users", endpointArgument.Url);
    }

    [Fact]
    public void EpwmTest()
    {
        var args = new[] { "epwm", "-n", "GetUsers", "-m", "post", "-u", "get-users" };
        var parser = new Parser();

        var result = parser.Parse(args);

        Assert.IsType<EndpointArgument>(result);

        var endpointArgument = result as EndpointArgument;

        Assert.NotNull(endpointArgument);
        Assert.Equal(EndpointType.EndpointWithoutMapper, endpointArgument.Type);
        Assert.Equal("GetUsers", endpointArgument.Name);
        Assert.Equal("post", endpointArgument.Method);
        Assert.Equal("get-users", endpointArgument.Url);
    }

    [Fact]
    public void EndpointEithoutResponseTest()
    {
        var args = new[] { "endpointwithoutresponse", "--name", "GetUsers", "--method", "post", "--url", "get-users" };
        var parser = new Parser();

        var result = parser.Parse(args);

        Assert.IsType<EndpointArgument>(result);

        var endpointArgument = result as EndpointArgument;

        Assert.NotNull(endpointArgument);
        Assert.Equal(EndpointType.EndpointWithoutResponse, endpointArgument.Type);
        Assert.Equal("GetUsers", endpointArgument.Name);
        Assert.Equal("post", endpointArgument.Method);
        Assert.Equal("get-users", endpointArgument.Url);
    }

    [Fact]
    public void EpwrTest()
    {
        var args = new[] { "epwr", "-n", "GetUsers", "-m", "post", "-u", "get-users" };
        var parser = new Parser();

        var result = parser.Parse(args);

        Assert.IsType<EndpointArgument>(result);

        var endpointArgument = result as EndpointArgument;

        Assert.NotNull(endpointArgument);
        Assert.Equal(EndpointType.EndpointWithoutResponse, endpointArgument.Type);
        Assert.Equal("GetUsers", endpointArgument.Name);
        Assert.Equal("post", endpointArgument.Method);
        Assert.Equal("get-users", endpointArgument.Url);
    }

    [Fact]
    public void EndpointEithoutRequestTest()
    {
        var args = new[] {"endpointwithoutrequest", "--name", "GetUsers", "--method", "post", "--url", "get-users" };
        var parser = new Parser();

        var result = parser.Parse(args);

        Assert.IsType<EndpointArgument>(result);

        var endpointArgument = result as EndpointArgument;

        Assert.NotNull(endpointArgument);
        Assert.Equal(EndpointType.EndpointWithoutRequest, endpointArgument.Type);
        Assert.Equal("GetUsers", endpointArgument.Name);
        Assert.Equal("post", endpointArgument.Method);
        Assert.Equal("get-users", endpointArgument.Url);
    }

    [Fact]
    public void EpwreqTest()
    {
        var args = new[] {"epwreq", "-n", "GetUsers", "-m", "post", "-u", "get-users" };
        var parser = new Parser();

        var result = parser.Parse(args);

        Assert.IsType<EndpointArgument>(result);

        var endpointArgument = result as EndpointArgument;

        Assert.NotNull(endpointArgument);
        Assert.Equal(EndpointType.EndpointWithoutRequest, endpointArgument.Type);
        Assert.Equal("GetUsers", endpointArgument.Name);
        Assert.Equal("post", endpointArgument.Method);
        Assert.Equal("get-users", endpointArgument.Url);
    }

    [Fact]
    public void EndpointWithoutResponseAndRequestTest()
    {
        var args = new[] {"endpointwithoutresponseandrequest", "--name", "GetUsers", "--method", "post", "--url", "get-users" };
        var parser = new Parser();

        var result = parser.Parse(args);

        Assert.IsType<EndpointArgument>(result);

        var endpointArgument = result as EndpointArgument;

        Assert.NotNull(endpointArgument);
        Assert.Equal(EndpointType.EndpointWithoutResponseAndRequest, endpointArgument.Type);
        Assert.Equal("GetUsers", endpointArgument.Name);
        Assert.Equal("post", endpointArgument.Method);
        Assert.Equal("get-users", endpointArgument.Url);
    }

    [Fact]
    public void EpwrreqTest()
    {
        var args = new[] {"epwrreq", "-n", "GetUsers", "-m", "post", "-u", "get-users" };
        var parser = new Parser();

        var result = parser.Parse(args);

        Assert.IsType<EndpointArgument>(result);

        var endpointArgument = result as EndpointArgument;

        Assert.NotNull(endpointArgument);
        Assert.Equal(EndpointType.EndpointWithoutResponseAndRequest, endpointArgument.Type);
        Assert.Equal("GetUsers", endpointArgument.Name);
        Assert.Equal("post", endpointArgument.Method);
        Assert.Equal("get-users", endpointArgument.Url);
    }

    #endregion

    #region Error Cases 

    [Fact]
    public void EndpointWrongArgumentTest()
    {
        var args = new[] { "endpoints", "--name", "GetUsers", "--method", "post", "--url", "get-users", "--entity", "User" };
        var parser = new Parser();

        var exception = Assert.Throws<Exception>(() => parser.Parse(args));

        Assert.Equal("endpoints is not a valid command.", exception.Message);
    }

    [Fact]
    public void EmptyNameTest()
    {
        var args = new[] { "endpoint", "--name", "", "--method", "post", "--url", "get-users", "--entity", "User" };
        var parser = new Parser();

        var exception = Assert.Throws<Exception>(() => parser.Parse(args));
        Assert.Equal("-n or --name can not be empty.", exception.Message);
    }

    [Fact]
    public void EmptyMethodTest()
    {
        var args = new[] { "endpoint", "--name", "GetUsers", "--method", "", "--url", "get-users", "--entity", "User" };
        var parser = new Parser();

        var exception = Assert.Throws<Exception>(() => parser.Parse(args));
        Assert.Equal("-m or --method can not be empty.", exception.Message);
    }

    [Fact]
    public void EmptyUrlTest()
    {
        var args = new[] { "endpoint", "--name", "GetUsers", "--method", "post", "--url", "", "--entity", "User" };
        var parser = new Parser();

        var exception = Assert.Throws<Exception>(() => parser.Parse(args));
        Assert.Equal("-u or --url can not be empty.", exception.Message);
    }

    [Fact]
    public void EmptyEntityTest()
    {
        var args = new[] { "endpoint", "--name", "GetUsers", "--method", "post", "--url", "get-users", "--entity", "" };
        var parser = new Parser();

        var exception = Assert.Throws<Exception>(() => parser.Parse(args));
        Assert.Equal("-e or --entity can not be empty.", exception.Message);
    }

    #endregion
}