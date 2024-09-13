using ProjectLocalize.DTOs;
using ProjectLocalize.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjectLocalize.Services
{
    public class CobrancaService
    {
        private readonly List<Cobranca> _cobrancas = new List<Cobranca>();

        public CobrancaDTO? GetCobrancaById(Guid id)
        {
            var cobranca = _cobrancas.FirstOrDefault(c => c.Id == id);
            return cobranca != null ? MapToDTO(cobranca) : null;
        }

        public IEnumerable<CobrancaDTO> GetAllCobrancas()
        {
            return _cobrancas.Select(c => MapToDTO(c));
        }

        public CobrancaDTO CreateCobranca(CobrancaDTO cobrancaDTO)
        {
            var cobranca = new Cobranca
            {
                Id = Guid.NewGuid(),
                Descricao = cobrancaDTO.Descricao,
                Valor = cobrancaDTO.Valor,
                Data = cobrancaDTO.Data,
                Pago = cobrancaDTO.Pago,
                ClienteId = cobrancaDTO.ClienteId
            };

            _cobrancas.Add(cobranca);
            return MapToDTO(cobranca);
        }

        public CobrancaDTO? UpdateCobranca(Guid id, CobrancaDTO cobrancaDTO)
        {
            var cobranca = _cobrancas.FirstOrDefault(c => c.Id == id);
            if (cobranca == null)
                return null;

            cobranca.Descricao = cobrancaDTO.Descricao;
            cobranca.Valor = cobrancaDTO.Valor;
            cobranca.Data = cobrancaDTO.Data;
            cobranca.Pago = cobrancaDTO.Pago;
            cobranca.ClienteId = cobrancaDTO.ClienteId;

            return MapToDTO(cobranca);
        }

        public bool DeleteCobranca(Guid id)
        {
            var cobranca = _cobrancas.FirstOrDefault(c => c.Id == id);
            if (cobranca == null)
                return false;

            _cobrancas.Remove(cobranca);
            return true;
        }

        private CobrancaDTO MapToDTO(Cobranca cobranca)
        {
            return new CobrancaDTO
            {
                Id = cobranca.Id,
                Descricao = cobranca.Descricao,
                Valor = cobranca.Valor,
                Data = cobranca.Data,
                Pago = cobranca.Pago,
                ClienteId = cobranca.ClienteId
            };
        }
    }
}
