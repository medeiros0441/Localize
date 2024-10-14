using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ProjectLocalize.DTOs;
using ProjectLocalize.Services;
using ProjectLocalize.Utils;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;  
namespace ProjectLocalize.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class PublicController : BaseController
    {

        public PublicController(IHttpContextAccessor httpContextAccessor, IConfiguration configuration, UsuarioService usuarioService)
            : base(httpContextAccessor, configuration, usuarioService)
        {        }

        [HttpPost("Logout")]
        public IActionResult Logout() // Removido o async
        {
            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new
            {
              
                message = "Logout realizado com sucesso."
            });
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] UsuarioDTO model) // Removido async
        {
            if (ValidationHelper.IsNullOrEmpty(model.Email) || 
                !ValidationHelper.IsValidEmail(model.Email) || 
                ValidationHelper.IsNullOrEmpty(model.Senha))
            {
                Console.WriteLine("Login falhou: Dados inválidos.");
                return BadRequest(new
                {
                   
                    message = "Solicitação inválida. Verifique as informações fornecidas."
                });
            }

            var usuarioDTO = _usuarioService.Authenticate(model.Email, model.Senha);
            if (usuarioDTO != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, usuarioDTO.Id.ToString()),
                    new Claim(ClaimTypes.Email, usuarioDTO.Email)
                };

                var token = _tokenManager.GenerateToken(new ClaimsIdentity(claims));


                return Ok(new
                {
                  
                    message = "Login realizado com sucesso.",
                    token,
                    data = usuarioDTO
                });
            }
            else
            {
                return BadRequest(new
                {
                   
                    message = "Tentativa de login inválida."
                });
            }
        }

       [HttpGet("CheckAuthentication")]
        // Método CheckAuthentication refatorado
        public IActionResult CheckAuthentication() 
        {
            // Verifica se o usuário está autenticado com base no ID do usuário da sessão
            if (id_usuario_session == Guid.Empty)
            {
                return Ok(new { message = "Usuário não autenticado." });
            }

            // Se chegou aqui, significa que o usuário está autenticado
            var response = new
            {
                authenticated = true,
                message = "Usuário autenticado.",
                user = new
                {
                    userId = id_usuario_session,
                    email = User.FindFirst(ClaimTypes.Email)?.Value // Se o e-mail estiver disponível no token
                }
            };

            return Ok(response);
        }



        [HttpGet("AcessoNegado")]
        public IActionResult AcessoNegado()
        {
            return Unauthorized(new
            {
               
                message = "Acesso negado. Você não tem permissão para acessar este recurso."
            });
        }

        [HttpPost("Cadastro")]
        public IActionResult Cadastro([FromBody] UsuarioDTO model)
        {
            if (model == null || !ModelState.IsValid || 
                ValidationHelper.IsNullOrEmpty(model.Email) || 
                !ValidationHelper.IsValidEmail(model.Email) || 
                ValidationHelper.IsNullOrEmpty(model.Senha))
            {
                return BadRequest(new
                {
                   
                    message = "Dados inválidos. Verifique as informações fornecidas."
                });
            }

            try
            {
                if (_usuarioService.EmailExiste(model.Email))
                {
                    return BadRequest(new
                    {
                       
                        message = "E-mail já cadastrado. Utilize outro e-mail."
                    });
                }

                var usuarioCriado = _usuarioService.CreateUsuario(new UsuarioDTO
                {
                    Nome = model.Nome,
                    Email = model.Email,
                    Senha = model.Senha
                });

                return Ok(new
                {
                  
                    message = "Usuário cadastrado com sucesso.",
                    data = new
                    {
                        usuarioCriado.Id,
                        usuarioCriado.Nome,
                        usuarioCriado.Email
                    }
                });
            }
            catch (Exception)
            {
                return BadRequest(new
                {
                   
                    message = "Ocorreu um erro inesperado. Tente novamente mais tarde."
                });
            }
        }
    }
}
