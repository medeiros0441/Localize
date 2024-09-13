using Microsoft.AspNetCore.Mvc;
using ProjectLocalize.DTOs;
using ProjectLocalize.Services;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class PublicController : ControllerBase
{
    private readonly UsuarioService _usuarioService;

    public PublicController(UsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    // POST: api/Public/Login
    [HttpPost("Login")]
    public IActionResult Login([FromBody] UsuarioDTO model)
    {
        if (ModelState.IsValid)
        {
            var usuarioDTO = _usuarioService.Authenticate(model.Email, model.Password);
            if (usuarioDTO != null)
            {
                // Retorne um token ou informações de autenticação conforme sua lógica
                // Exemplo: retornar o usuário autenticado como JSON
                return Ok(usuarioDTO);
            }
            else
            {
                return Unauthorized("Invalid login attempt.");
            }
        }

        return BadRequest("Invalid request.");
    }

    // GET: api/Public/CheckAuthentication
    [HttpGet("CheckAuthentication")]
    public IActionResult CheckAuthentication()
    {
        if (User.Identity.IsAuthenticated)
        {
            return Ok(new { IsAuthenticated = true, UserName = User.Identity.Name });
        }
        else
        {
            return Ok(new { IsAuthenticated = false });
        }
    }

    // POST: api/Public/Cadastro
    [HttpPost("Cadastro")]
    public IActionResult Cadastro([FromBody] UsuarioDTO model)
    {
        if (ModelState.IsValid)
        {
            var usuarioDTO = new UsuarioDTO
            {
                Nome = model.Username,
                Email = model.Email,
                Senha = model.Password
            };

            var result = _usuarioService.CreateUsuario(usuarioDTO);
            if (result != null)
            {
                 
                return CreatedAtAction(nameof(Cadastro), new { id = result.Id }, result);
            }
            else
            {
                return BadRequest("Failed to create user.");
            }
        }

        return BadRequest("Invalid request.");
    }
}
