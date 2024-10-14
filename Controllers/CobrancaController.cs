using ProjectLocalize.DTOs;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Authorization;
using ProjectLocalize.Services;
using Microsoft.AspNetCore.Http;

namespace ProjectLocalize.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CobrancaController : BaseController
    {
        private readonly CobrancaService _cobrancaService;
        private readonly ClienteService _clienteService;

        public CobrancaController(ClienteService clienteService, CobrancaService cobrancaService, IHttpContextAccessor httpContextAccessor, IConfiguration configuration, UsuarioService usuarioService)
            : base(httpContextAccessor, configuration, usuarioService)
        {
            _clienteService = clienteService;
            _cobrancaService = cobrancaService;
        }

        [HttpGet("{id}")]
        public IActionResult GetCobrancaById(Guid id)
        {
            // Verifica se a cobrança existe
            if (!_cobrancaService.CobrancaExiste(id))
                return NotFound(new { message = "Cobrança não encontrada." });

            // Verifica se a cobrança pertence ao usuário da sessão
            if (!_cobrancaService.CobrancaPertenceAoUsuario(id, id_usuario_session))
                return Unauthorized(new { message = "A cobrança não pertence ao usuário fornecido." });

            var cobranca = _cobrancaService.GetCobrancaById(id);
            return Ok(new
            {
                message = "Cobrança recuperada com sucesso.",
                data = cobranca
            });
        }

        [HttpGet]
        public IActionResult GetAllCobrancas()
        {
            var cobrancas = _cobrancaService.GetCobrancasByUsuarioId(id_usuario_session);
            return Ok(new
            {
                message = "Lista de cobranças recuperada com sucesso.",
                data = cobrancas
            });
        }

        
        [HttpPost]
        public IActionResult CreateCobranca([FromBody] CobrancaDTO cobrancaDTO)
        {
            try
            {
                // Valida se o DTO é válido
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        message = "Dados inválidos.",
                        errors = ModelState
                    });
                }

                // Verifica se o Cliente existe
                if (!_clienteService.ClienteExists(cobrancaDTO.ClienteId))
                {
                    return NotFound(new
                    {
                        message = "Cliente não encontrado."
                    });
                }

                // Verifica se o usuário está relacionado com o Cliente
                if (!_clienteService.IsUsuarioRelacionadoComCliente(id_usuario_session, cobrancaDTO.ClienteId))
                {
                    return StatusCode(403, new
                    {
                        message = "O usuário não está autorizado a criar cobrança para este cliente."
                    });
                }

                // Cria a cobrança
                var cobranca = _cobrancaService.CreateCobranca(cobrancaDTO);

                // Retorna o resultado da criação com o status 201 Created
                return CreatedAtAction(nameof(GetCobrancaById), new { id = cobranca.Id }, new
                {
                    message = "Cobrança criada com sucesso.",
                    data = cobranca
                });
            }
            catch (Exception ex)
            {
                // Retorna um erro genérico em caso de exceção
                return StatusCode(500, new
                {
                    message = "Erro ao criar cobrança.",
                    details = ex.Message // Você pode optar por não expor detalhes da exceção em produção
                });
            }
        }
          // Método para atualizar o status de pagamento
        [HttpPut("{id}/pago")]
        public IActionResult UpdatePago(Guid id, [FromBody] bool pago)
        {
            if (id == Guid.Empty)
            {
                return BadRequest("ID inválido.");
            }
            
            // Verifica se a cobrança existe
            if (!_cobrancaService.CobrancaExiste(id))
                return NotFound(new { message = "Cobrança não encontrada." });

            // Verifica se a cobrança pertence  ao cliente e se esse cliente pertence ao  usuário da sessão
            if (!_cobrancaService.CobrancaPertenceAoUsuario(id, id_usuario_session))
                return Unauthorized(new { message = "A cobrança não pertence ao usuário fornecido." });
                
            var cobrancaAtualizada = _cobrancaService.UpdatePago(id, pago);
            
            if (cobrancaAtualizada == null)
            {
                return NotFound("Cobrança não encontrada.");
            }

            return Ok(cobrancaAtualizada); // Retorna a cobrança atualizada
        }
        [HttpPut("{id}")]
        public IActionResult UpdateCobranca(Guid id, [FromBody] CobrancaDTO cobrancaDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(new
                {
                    message = "Dados inválidos.",
                    errors = ModelState
                });

            // Verifica se a cobrança existe
            if (!_cobrancaService.CobrancaExiste(id))
                return NotFound(new { message = "Cobrança não encontrada." });

            // Verifica se a cobrança pertence  ao cliente e se esse cliente pertence ao  usuário da sessão
            if (!_cobrancaService.CobrancaPertenceAoUsuario(id, id_usuario_session))
                return Unauthorized(new { message = "A cobrança não pertence ao usuário fornecido." });

            var cobranca = _cobrancaService.UpdateCobranca(id, cobrancaDTO);
            return Ok(new
            {
                message = "Cobrança atualizada com sucesso.",
                data = cobranca
            });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCobranca(Guid id)
        {
            // Verifica se a cobrança existe
            if (!_cobrancaService.CobrancaExiste(id))
                return NotFound(new { message = "Cobrança não encontrada." });

            // Verifica se a cobrança pertence ao usuário da sessão
            if (!_cobrancaService.CobrancaPertenceAoUsuario(id, id_usuario_session))
                return Unauthorized(new { message = "A cobrança não pertence ao usuário fornecido." });

            var result = _cobrancaService.DeleteCobranca(id);
            return Ok(new
            {
                message = "Cobrança excluída com sucesso."
            });
        }
    }
}
