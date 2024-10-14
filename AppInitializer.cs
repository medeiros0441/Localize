using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using ProjectLocalize.Data;
using ProjectLocalize.Services;
using System.Text;
using ProjectLocalize.Utils;

public static class AppInitializer
{
    public static void ConfigureServices(WebApplicationBuilder builder)
    {
        // Verifica a string de conexão
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("A connection string named 'DefaultConnection' was not found in the configuration.");

        // Configura o DbContext com a string de conexão
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlite(connectionString));

        // Adiciona os serviços ao contêiner
        builder.Services.AddScoped<UsuarioService>();
        builder.Services.AddScoped<CobrancaService>();
        builder.Services.AddScoped<ClienteService>();

        // Adiciona o serviço IHttpContextAccessor ao container de DI
        builder.Services.AddHttpContextAccessor();

        // Adiciona o filtro de autorização customizado
        builder.Services.AddScoped<CustomAuthorizationFilter>();
        
        // `IConfiguration` é automaticamente injetado através do `builder.Configuration`
        builder.Services.AddSingleton<IConfiguration>(builder.Configuration);
        // Configura CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigins", policyBuilder =>
                policyBuilder
                    .WithOrigins("http://localhost:3000")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
        });

        // Configura JWT Authentication
        ConfigureJwtAuthentication(builder.Services, builder.Configuration);
        
        // Adiciona serviços para controladores e views
        builder.Services.AddControllersWithViews(options =>
        {
            // Adiciona o filtro globalmente
            options.Filters.Add<CustomAuthorizationFilter>();
        });
    }

    
    public static void ConfigureJwtAuthentication(IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("Jwt");
        var secretKey = jwtSettings["SecretKey"] 
                        ?? throw new InvalidOperationException("SecretKey não está configurado.");
        var issuer = jwtSettings["Issuer"] 
                    ?? throw new InvalidOperationException("Issuer não está configurado.");
        var audience = jwtSettings["Audience"] 
                    ?? throw new InvalidOperationException("Audience não está configurado.");

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateLifetime = true
            };
        });
    }

    public static void ConfigureMiddleware(WebApplication app)
    {
        // Habilita CORS
        app.UseCors("AllowSpecificOrigins");

        // Middleware para exibir erros detalhados em desenvolvimento
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/Home/Error"); // ou outro endpoint para tratamento de erros
            app.UseHsts();
        }

        // Middleware para redirecionamento de HTTPS
        app.UseHttpsRedirection();

        // Middleware para servir arquivos estáticos (React app)
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "ClientApp/build")),
            RequestPath = ""
        });

        // Middleware de autenticação e autorização
        app.UseAuthentication();
        app.UseAuthorization();

        // Mapeamento de rotas para os controladores da API
        app.MapControllers();

        // Serve o arquivo index.html para rotas não mapeadas (SPA)
        app.MapFallbackToFile("index.html");
    }
}
