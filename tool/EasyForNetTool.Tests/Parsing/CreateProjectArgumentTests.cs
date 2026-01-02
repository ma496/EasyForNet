namespace EasyForNetTool.Tests.Parsing;

using EasyForNetTool.Parsing;

public class CreateProjectArgumentTests
{
    [Fact]
    public void CreateProjectArgument_Name_Valid()
    {
        var argument = new CreateProjectArgument
        {
            Name = "validName"
        };
        Assert.Equal("ValidName", argument.Name);

        argument.Name = "valid-name";
        Assert.Equal("ValidName", argument.Name);

        argument.Name = "valid_name";
        Assert.Equal("ValidName", argument.Name);
    }

    [Fact]
    public void CreateProjectArgument_Name_Invalid()
    {
        Assert.Throws<UserFriendlyException>(() => new CreateProjectArgument
        {
            Name = "invalid name"
        });

        Assert.Throws<UserFriendlyException>(() => new CreateProjectArgument
        {
            Name = "-invalid-name"
        });

        Assert.Throws<UserFriendlyException>(() => new CreateProjectArgument
        {
            Name = "invalid-name-"
        });

        Assert.Throws<UserFriendlyException>(() => new CreateProjectArgument
        {
            Name = "invalid-name_"
        });

        Assert.Throws<UserFriendlyException>(() => new CreateProjectArgument
        {
            Name = "_invalid-name"
        });

        Assert.Throws<UserFriendlyException>(() => new CreateProjectArgument
        {
            Name = "1invalid-name"
        });

        Assert.Throws<UserFriendlyException>(() => new CreateProjectArgument
        {
            Name = "invalid-name1"
        });

        Assert.Throws<UserFriendlyException>(() => new CreateProjectArgument
        {
            Name = "invalid*name"
        });
    }
}
