using Microsoft.EntityFrameworkCore;
using ProjectLocalize.Data;
using Microsoft.Extensions.FileProviders;
using System.IO;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("A connection string named 'DefaultConnection' was not found in the configuration.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

// Adicionar serviços ao contêiner.
builder.Services.AddControllersWithViews();

// Configuração de CORS, se necessário
// builder.Services.AddCors();

var app = builder.Build();

// Configurar o pipeline de requisições HTTP.
if (!app.Environment.IsDevelopment())
{
    // O valor padrão de HSTS é 30 dias. Talvez você queira alterar isso para cenários de produção.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Configurar o roteamento para API e MVC
app.MapControllers(); // Configura rotas para todos os controladores

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Configurar para servir os arquivos do build do React
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "ClientApp/build")),
    RequestPath = ""
});

// Serve o arquivo index.html para todas as rotas não mapeadas
app.MapFallbackToFile("index.html");

app.Run();
