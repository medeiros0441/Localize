using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ProjectLocalize.Utils;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using ProjectLocalize.Services;
using System.Collections.Generic;

namespace ProjectLocalize.Controllers
{
    [Authorize]
    [ServiceFilter(typeof(CustomAuthorizationFilter))] // Aplica o filtro de autorização
    public abstract class BaseController : ControllerBase
    {
        protected readonly UsuarioService _usuarioService; // Propriedade de instância
        protected readonly TokenManager _tokenManager;
        protected Guid id_usuario_session { get; private set; } // Mantido como propriedade

        // Construtor que recebe as dependências necessárias
        public BaseController(IHttpContextAccessor httpContextAccessor, IConfiguration configuration, UsuarioService usuarioService)
        {
            _tokenManager = new TokenManager(configuration ?? throw new ArgumentNullException(nameof(configuration))); // Verifica se a configuração é nula
            _usuarioService = usuarioService ?? throw new InvalidOperationException("UsuarioService cannot be null."); // Garantindo que não seja nulo
            id_usuario_session = ExtractUserId(httpContextAccessor); // Inicializa o ID do usuário
        }
        private Guid ExtractUserId(IHttpContextAccessor httpContextAccessor)
        {
                    // Recupera o cabeçalho de autorização
            var authorizationHeader = httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();

            // Verifica se o cabeçalho está vazio ou se não começa com "Bearer "
            if (string.IsNullOrWhiteSpace(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
            {
                return Guid.Empty; // Retorna Guid.Empty se o cabeçalho não estiver presente ou não for válido
            }

            // Extrai o token, removendo "Bearer "
            // Extrai o token, removendo "Bearer " e "null "
            var token = authorizationHeader
                .Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase) // Remove "Bearer "
                .Replace("null", "", StringComparison.OrdinalIgnoreCase) // Remove "null "
                .Trim(); // Remove espaços em branco

            // Verifica se o token é válido
            if (string.IsNullOrEmpty(token))
            {
                return Guid.Empty; // Retorna Guid.Empty se o token for vazio ou nulo
            }


            try
            {
                // Valida o token. Aqui assumimos que _tokenManager é garantido não nulo pelo construtor
                _tokenManager.ValidateToken(token); 

                // Decodifica o token JWT
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

                // Extrai o claim do ID do usuário (NameIdentifier)
                var userIdClaim = jsonToken?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                // Verifica se o ID do usuário é válido
                if (Guid.TryParse(userIdClaim, out var userId) && _usuarioService?.UsuarioExists(userId) == true)
                {
                    Console.WriteLine($"ID do usuário extraído: {userId}");
                    return userId; // Retorna o ID válido
                }

                Console.WriteLine("ID do usuário inválido ou usuário não encontrado.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Falha na validação do token: {ex.Message}");
            }

            return Guid.Empty; // Retorna Guid.Empty se não for possível extrair o ID do usuário
        }

        // Método para lidar com os erros de validação do ModelState
        protected IActionResult HandleModelErrors() 
        {
            var errors = new Dictionary<string, List<string>>();

            foreach (var key in ModelState.Keys)
            {
                var state = ModelState[key];
                if (state != null && state.Errors.Count > 0) // Verifica se 'state' não é nulo
                {
                    var fieldErrors = state.Errors.Select(error => error.ErrorMessage).ToList();
                    errors[key] = fieldErrors;
                }
            }

            return BadRequest(new
            {
                message = "Dados inválidos.",
                errors = errors
            });
        }

    }
}
