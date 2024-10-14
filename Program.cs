using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    ContentRootPath = Directory.GetCurrentDirectory(),
    WebRootPath = "ClientApp/build"
});

// Configura os serviços
AppInitializer.ConfigureServices(builder);


// Constrói o app
var app = builder.Build();

// Configura o middleware
AppInitializer.ConfigureMiddleware(app);

// Executa o aplicativo
app.Run();
