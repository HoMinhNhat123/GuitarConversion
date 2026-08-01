var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


app.MapGet("/api/initialCommit", () =>
{
    return Results.Ok(new
    {
        message = "This is my initial commit"
    });
});

app.Run();