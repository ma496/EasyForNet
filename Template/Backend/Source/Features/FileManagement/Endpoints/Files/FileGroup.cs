namespace Backend.Features.FileManagement.Endpoints.Files;

public class FileGroup : Group
{
    public FileGroup()
    {
        Configure("file-management", ep => {});
    }
}