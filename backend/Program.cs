var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

const string FrontendCorsPolicy = "frontendAllowed";

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(FrontendCorsPolicy); 

app.MapGet("/api/initialCommit", () =>
{
    return Results.Ok(new
    {
        message = "This is my initial commit"
    });
});

app.Run();