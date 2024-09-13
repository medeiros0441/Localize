using ProjectLocalize.DTOs;
using ProjectLocalize.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace ProjectLocalize.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        public UsuarioController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet("{id}")]
        public ActionResult<UsuarioDTO> GetUsuarioById(Guid id)
        {
            var usuario = _usuarioService.GetUsuarioById(id);
            if (usuario == null)
                return NotFound();

            return Ok(usuario);
        }

        [HttpGet]
        public ActionResult<IEnumerable<UsuarioDTO>> GetAllUsuarios()
        {
            var usuarios = _usuarioService.GetAllUsuarios();
            return Ok(usuarios);
        }
   

        [HttpPost("login")]
        public IActionResult Login([FromBody] UsuarioDTO DTO)
        {
            var isAuthenticated = _usuarioService.Authenticate(DTO.Email, DTO.Senha);
            if (isAuthenticated == null)
                return Unauthorized("Invalid credentials");

            // Crie uma sessão ou token aqui
            // Para simplicidade, estamos apenas retornando um sucesso
            return Ok("Login successful");
        }

        [HttpPost("register")]
        public ActionResult<UsuarioDTO> Register([FromBody] UsuarioDTO usuarioDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var usuario = _usuarioService.CreateUsuario(usuarioDTO);
            return CreatedAtAction(nameof(Login), new { id = usuario.Id }, usuario);
        }

        [HttpPut("{id}")]
        public ActionResult<UsuarioDTO> UpdateUsuario(Guid id, [FromBody] UsuarioDTO usuarioDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var usuario = _usuarioService.UpdateUsuario(id, usuarioDTO);
            if (usuario == null)
                return NotFound();

            return Ok(usuario);
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteUsuario(Guid id)
        {
            var result = _usuarioService.DeleteUsuario(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
