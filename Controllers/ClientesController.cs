 using ProjectLocalize.DTOs;
using ProjectLocalize.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace ProjectLocalize.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly ClienteService _clienteService;

        public ClienteController(ClienteService clienteService)
        {
            _clienteService = clienteService;
        }

        [HttpGet("{id}")]
        public ActionResult<ClienteDTO> GetClienteById(Guid id)
        {
            var cliente = _clienteService.GetClienteById(id);
            if (cliente == null)
                return NotFound();

            return Ok(cliente);
        }

        [HttpGet]
        public ActionResult<IEnumerable<ClienteDTO>> GetAllClientes()
        {
            var clientes = _clienteService.GetAllClientes();
            return Ok(clientes);
        }

        [HttpPost]
        public ActionResult<ClienteDTO> CreateCliente([FromBody] ClienteDTO clienteDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cliente = _clienteService.CreateCliente(clienteDTO);
            return CreatedAtAction(nameof(GetClienteById), new { id = cliente.Id }, cliente);
        }

        [HttpPut("{id}")]
        public ActionResult<ClienteDTO> UpdateCliente(Guid id, [FromBody] ClienteDTO clienteDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cliente = _clienteService.UpdateCliente(id, clienteDTO);
            if (cliente == null)
                return NotFound();

            return Ok(cliente);
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteCliente(Guid id)
        {
            var result = _clienteService.DeleteCliente(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
