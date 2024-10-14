using ProjectLocalize.DTOs;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Authorization;
using ProjectLocalize.Services; 
using Microsoft.AspNetCore.Http;  

namespace ProjectLocalize.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : BaseController  
    {

        // Construtor corrigido
        public UsuarioController(UsuarioService usuarioService, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
            : base(httpContextAccessor, configuration,usuarioService)
        {
        }
        

        [HttpGet("{id}")]
        public IActionResult GetUsuarioById(Guid id)
        {
            var usuario = _usuarioService.GetUsuarioById(id);
            if (usuario == null)
                return NotFound(new {  message = "Usuário não encontrado." });

            return Ok(new {  message = "Usuário encontrado com sucesso.", data = usuario });
        }

        [HttpGet]
        public IActionResult GetAllUsuarios()
        {
            var usuarios = _usuarioService.GetAllUsuarios();
            return Ok(new {  message = "Usuários recuperados com sucesso.", data = usuarios });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UsuarioDTO dto)
        {
            var isAuthenticated = _usuarioService.Authenticate(dto.Email, dto.Senha);
            if (isAuthenticated == null)
                return BadRequest(new {  message = "Credenciais inválidas." });

            // Retorne o token ou sessão conforme sua lógica
            return Ok(new {  message = "Login realizado com sucesso." });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UsuarioDTO usuarioDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(new {  message = "Dados inválidos.", errors = ModelState });

            var usuario = _usuarioService.CreateUsuario(usuarioDTO);
            return CreatedAtAction(nameof(GetUsuarioById), new { id = usuario.Id }, new {  message = "Usuário registrado com sucesso.", data = usuario });
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUsuario(Guid id, [FromBody] UsuarioDTO usuarioDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(new {  message = "Dados inválidos.", errors = ModelState });

            var usuario = _usuarioService.UpdateUsuario(id, usuarioDTO);
            if (usuario == null)
                return NotFound(new {  message = "Usuário não encontrado." });

            return Ok(new {  message = "Usuário atualizado com sucesso.", data = usuario });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUsuario(Guid id)
        {
            var result = _usuarioService.DeleteUsuario(id);
            if (!result)
                return NotFound(new {  message = "Usuário não encontrado." });

            return Ok(new {  message = "Usuário excluído com sucesso." });
        }
    }
}
