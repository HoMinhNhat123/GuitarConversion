// api/ProjectEndpoints.cs 

using System.Text.Json;

namespace guitarConversionNamespace.Api;

public static class ProjectEndpoints
{

  //Path to root/.GuitarConversion 
  private static readonly string baseFolderPath = Path.GetFullPath(
    Path.Combine(Directory.GetCurrentDirectory(),
      "..",
      ".GuitarConversion"));

  public record Project(string ProjectId, string Name);

  public static void MapProjectEndpoints(this WebApplication app)
  {
    /*
    Freshly made new project =D
    create UUID v4,
    store it under root/.GuitarConversion/{UUIDv4 folder} 
     */
    app.MapPost("/api/newProject", async () =>
    {
      //uuid v4
      var id = Guid.NewGuid().ToString();

      //create specific folder path under .GuitarConversion/
      var folderPath = Path.Combine(baseFolderPath, id);
      Directory.CreateDirectory(folderPath);

      var myProject = new Project(id, "Default project");

      var filePath = Path.Combine(folderPath, "package.json");
      var json = JsonSerializer.Serialize(myProject, new JsonSerializerOptions { WriteIndented = true });
      await File.WriteAllTextAsync(filePath, json);

      return Results.Ok(new
      {
        projectId = id,
      });
    });


    /*
      Upon calling, returns a list
      of project's names, and ids
     */
    app.MapGet("/api/getProjects", async () =>
    {

      List<Project> projects = new List<Project>();

      /*For each folder under .GuitarConversion,
        Read its package.json, add it to projects list
       */
      foreach (var folder in Directory.GetDirectories(baseFolderPath))
      {
        //read json file
        var jsonFilePath = Path.Combine(folder, "package.json");
        if (!File.Exists(jsonFilePath)) { return Results.NotFound(); }

        string json = await File.ReadAllTextAsync(jsonFilePath);
        Project? myProject = JsonSerializer.Deserialize<Project>(json);

        if (myProject != null) { projects.Add(myProject); }
      }
      return Results.Ok(projects);
    });

    /*
      Upon calling, returns the package.json of the project by its id
     */
    app.MapGet("/api/getProject/{projectId}", async (string? projectId) =>
    {
      if (projectId == null)
      {
        return Results.BadRequest("no specific projectId");
      }

      string jsonFilePath = Path.Combine(baseFolderPath, projectId, "package.json");
      if (!File.Exists(jsonFilePath)) { return Results.NotFound(); }

      string json = await File.ReadAllTextAsync(jsonFilePath);
      Project? myProject = JsonSerializer.Deserialize<Project>(json);
      return Results.Ok(myProject);
    });
  }
}