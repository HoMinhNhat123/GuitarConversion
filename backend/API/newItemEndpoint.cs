// api/newItemsEndpoints.cs 

using Microsoft.AspNetCore.Mvc;

namespace guitarConversionNamespace.Api;

public static class newItem
{

  public static void newItemEndpoint(this WebApplication app)
  {
    /*
    create UUID v4,
    store it under root/.guitarConversion/{UUIDv4 folder} 
     */
    app.MapPost("/api/newItem", () =>
    {
      //uuid v4
      var id = Guid.NewGuid().ToString();

      //path to .GuitarConversion
      var folderPath = Path.Combine(Directory.GetCurrentDirectory(),
        "..",
        ".GuitarConversion",
        id);
      folderPath = Path.GetFullPath(folderPath);

      Directory.CreateDirectory(folderPath);
      return Results.Ok(new
      {
        itemId = id,
        testingPath = folderPath
      }); 
    });
  }
}