using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
 
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    ContentRootPath = Directory.GetCurrentDirectory(),
    WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot") // Use Path.Combine para garantir o caminho correto
});

// Configura os serviços
AppInitializer.ConfigureServices(builder);


// Constrói o app
var app = builder.Build();

// Configura o middleware
AppInitializer.ConfigureMiddleware(app);

// Executa o aplicativo
app.Run();
