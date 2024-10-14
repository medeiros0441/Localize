using ProjectLocalize.DTOs;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Authorization;
using ProjectLocalize.Services; 
using Microsoft.AspNetCore.Http;  
using System.Collections.Generic;
using System.Linq; // Importar para usar Any()

namespace ProjectLocalize.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClienteController : BaseController // Herda de BaseController
    {
        private readonly ClienteService _clienteService;

        public ClienteController(IHttpContextAccessor httpContextAccessor, IConfiguration configuration, UsuarioService usuarioService, ClienteService clienteService)
            : base(httpContextAccessor, configuration, usuarioService)
        {
            _clienteService = clienteService;
        }

        // GET: api/cliente
        [HttpGet]
        public ActionResult<IEnumerable<ClienteDTO>> GetAllClientes()
        {
            var usuarioId = id_usuario_session;
            var clientes = _clienteService.GetAllClientes(usuarioId);

            if (clientes == null || !clientes.Any())
            {
                return NotFound(new { message = "Nenhum cliente cadastrado." });
            }
            return Ok((new { data =clientes}));
        }

        // GET: api/cliente/{id}
        [HttpGet("{id}")]
        public ActionResult<ClienteDTO> GetClienteById(Guid id)
        {
            var cliente = _clienteService.GetClienteById(id, id_usuario_session);
            if (cliente == null)
            {
                return NotFound(new { message = "Cliente não encontrado." });
            }
            return Ok((new { data =cliente}));
        }

        [HttpPost]
        public ActionResult<ClienteDTO> CreateCliente([FromBody] ClienteDTO clienteDTO)
        {
            try
            {
                if (!_usuarioService.UsuarioExists(id_usuario_session))
                {
                    return Forbid("Usuário não está cadastrado.");
                }

                clienteDTO.UsuarioId = id_usuario_session;

                if (_clienteService.DocumentoExists(clienteDTO.Documento))
                {
                    return Conflict(new { message = "Documento já cadastrado." });
                }

                if (_clienteService.TelefoneExists(clienteDTO.Telefone))
                {
                    return Conflict(new { message = "Telefone já cadastrado." });
                }

                var createdCliente = _clienteService.CreateCliente(clienteDTO);
                return CreatedAtAction(nameof(GetClienteById), new { id = createdCliente.Id }, createdCliente);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Erro ao criar cliente: {ex.Message}" });
            }
        }

        // PUT: api/cliente/{id}
    [HttpPut("{id}")]
    public ActionResult<ClienteDTO> UpdateCliente(Guid id, [FromBody] ClienteDTO clienteDTO)
    {
        // Verifica se o cliente existe
        if (!_clienteService.ClienteExists(id))
        {
            return NotFound(new { message = "Cliente não encontrado." });
        }

        // Verifica se o usuário tem permissão para atualizar o cliente
        if (!_clienteService.IsUsuarioRelacionadoComCliente(id_usuario_session, id))
        {
            return Forbid("Usuário não tem permissão para atualizar este cliente.");
        }

        // Verifica se o documento já está cadastrado, ignorando o cliente atual
        if (_clienteService.DocumentoExists(clienteDTO.Documento, id))
        {
            return Conflict(new { message = "Documento já cadastrado." });
        }

        // Verifica se o telefone já está cadastrado, ignorando o cliente atual
        if (_clienteService.TelefoneExists(clienteDTO.Telefone, id))
        {
            return Conflict(new { message = "Telefone já cadastrado." });
        }

        clienteDTO.UsuarioId = id_usuario_session; 
        clienteDTO.Id = id; // Certifique-se de que o Id do clienteDTO é atualizado com o id recebido
        var updatedCliente = _clienteService.UpdateCliente(id, clienteDTO);
        
        if (updatedCliente == null)
        {
            return NotFound(new { message = "Cliente não encontrado ou não pertence ao usuário." });
        }

        return Ok(updatedCliente);
    }


        // DELETE: api/cliente/{id}
        [HttpDelete("{id}")]
        public ActionResult<bool> DeleteCliente(Guid id)
        {
              // Verifica se o cliente existe
            if (!_clienteService.ClienteExists(id))
            {
                return NotFound(new { message = "Cliente não encontrado." });
            }
            if (!_clienteService.IsUsuarioRelacionadoComCliente(  id_usuario_session,id))
            {
                return Forbid("Usuário não tem permissão para excluir este cliente.");
            }

            var result = _clienteService.DeleteCliente( id,id_usuario_session);
            
            if (!result)
            {
                return NotFound(new { message = "Cliente não encontrado ou não pertence ao usuário." });
            }

            return NoContent(); 
        }
    }
}
