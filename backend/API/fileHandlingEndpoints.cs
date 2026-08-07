namespace guitarConversionNamespace.Api;

public static class fileHandler
{   

  //Path to root/.GuitarConversion 
  private static readonly string baseFolderPath = Path.GetFullPath(
  Path.Combine(Directory.GetCurrentDirectory(),
    "..",
    ".GuitarConversion"));
  public static void MapFileEndpoints(this WebApplication app)
  {

    /*
    Create a new pdf file under .GuitarConversion/{projectId}
    Return opaque ID that let the frontend store it under UI 
    */
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
      var storageDir = Path.Combine(baseFolderPath, projectId, "pdf_files");
      Directory.CreateDirectory(storageDir);
      var storagePath = Path.Combine(storageDir, fileId);

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

    /*
    Return the pdf with projectId and pdfId
     */
    app.MapGet("/api/{projectId}/{pdfId}", async (string projectId, string pdfId) =>
    {
      //guard agaisnt path traversal
      if (pdfId.Contains("..") || projectId.Contains("..")) return Results.BadRequest("Invalid path");

      var storagePath = Path.Combine(baseFolderPath, projectId, "pdf_files", pdfId);
      if (!File.Exists(storagePath)) return Results.Ok(new {notFound = "not found"});

      var stream = File.OpenRead(storagePath);
      return Results.File(stream, contentType: "application/pdf");
    });
  }
}