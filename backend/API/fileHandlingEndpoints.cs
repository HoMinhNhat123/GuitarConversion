namespace guitarConversionNamespace.Api;

public static class fileHandler
{   

  //Path to root/.GuitarConversion 
  private static readonly string baseFolderPath = Path.GetFullPath(
  Path.Combine(Directory.GetCurrentDirectory(),
    "..",
    ".GuitarConversion"));
  /*
  Create a new pdf file under .GuitarConversion/{projectId}
  Return opaque ID that let the frontend store it under UI 
  */
  public static void MapFileEndpoints(this WebApplication app)
  {
    app.MapPost("/api/{projectId}/newPdf", async (string projectId, IFormFile? file) =>
    {

      // guard against bad request
      if (file is null || file.Length == 0)
      {
        return Results.BadRequest("No file provided");
      }
      if (file.ContentType != "application/pdf")
      {
        return Results.BadRequest("only pdf approved");
      }

      var fileId = Guid.NewGuid().ToString(); fileId += ".pdf";
      var storagePath = Path.Combine(baseFolderPath, projectId, fileId);

      await using (var stream = File.Create(storagePath))
      {
        await file.CopyToAsync(stream);
      }

      return Results.Ok(new
      {
        fileId
      });
    })
    .DisableAntiforgery();
  }
}