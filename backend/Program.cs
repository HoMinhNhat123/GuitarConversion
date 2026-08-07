using guitarConversionNamespace.Api;
var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapProjectEndpoints();
app.MapFileEndpoints();

app.Run();

