using ProjectLocalize.DTOs;
using ProjectLocalize.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace ProjectLocalize.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CobrancaController : ControllerBase
    {
        private readonly CobrancaService _cobrancaService;

        public CobrancaController(CobrancaService cobrancaService)
        {
            _cobrancaService = cobrancaService;
        }

        [HttpGet("{id}")]
        public ActionResult<CobrancaDTO> GetCobrancaById(Guid id)
        {
            var cobranca = _cobrancaService.GetCobrancaById(id);
            if (cobranca == null)
                return NotFound();

            return Ok(cobranca);
        }

        [HttpGet]
        public ActionResult<IEnumerable<CobrancaDTO>> GetAllCobrancas()
        {
            var cobrancas = _cobrancaService.GetAllCobrancas();
            return Ok(cobrancas);
        }

        [HttpPost]
        public ActionResult<CobrancaDTO> CreateCobranca([FromBody] CobrancaDTO cobrancaDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cobranca = _cobrancaService.CreateCobranca(cobrancaDTO);
            return CreatedAtAction(nameof(GetCobrancaById), new { id = cobranca.Id }, cobranca);
        }

        [HttpPut("{id}")]
        public ActionResult<CobrancaDTO> UpdateCobranca(Guid id, [FromBody] CobrancaDTO cobrancaDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cobranca = _cobrancaService.UpdateCobranca(id, cobrancaDTO);
            if (cobranca == null)
                return NotFound();

            return Ok(cobranca);
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteCobranca(Guid id)
        {
            var result = _cobrancaService.DeleteCobranca(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
