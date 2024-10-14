using ProjectLocalize.Data; // Inclua o namespace correto
using ProjectLocalize.DTOs;
using ProjectLocalize.Models;
using Microsoft.EntityFrameworkCore; // Para acesso a DbContext
using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjectLocalize.Services
{
    public class CobrancaService
    {
        private readonly ApplicationDbContext _dbContext;

        public CobrancaService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public CobrancaDTO? GetCobrancaById(Guid id)
        {
            var cobranca = _dbContext.Cobrancas.Find(id); // Busca cobrança pelo ID
            return cobranca != null ? MapToDTO(cobranca) : null;
        }

        // Verifica se a cobrança está relacionada ao cliente e se o cliente está relacionado ao usuário fornecido
        public bool CobrancaPertenceAoUsuario(Guid idCobranca, Guid idUsuario)
        {
            return _dbContext.Cobrancas
                .Any(c => c.Id == idCobranca && c.Cliente != null && c.Cliente.UsuarioId == idUsuario);
        }

        // Verifica se a cobrança existe no banco de dados
        public bool CobrancaExiste(Guid idCobranca)
        {
            return _dbContext.Cobrancas.Any(c => c.Id == idCobranca);
        }



        public IEnumerable<CobrancaDTO> GetAllCobrancas()
        {
            return _dbContext.Cobrancas.Select(c => MapToDTO(c)).ToList(); // Obtém todas as cobranças
        }
       public IEnumerable<CobrancaDTO> GetCobrancasByUsuarioId(Guid idUsuario)
        {
            // Verifica se o idUsuario é válido
            if (idUsuario == Guid.Empty)
            {
                throw new ArgumentException("O ID do usuário não pode ser vazio.", nameof(idUsuario));
            }

            // Consulta as cobranças filtrando pelo idUsuario através do Cliente
            var cobrancas = _dbContext.Cobrancas
                .Include(c => c.Cliente) // Inclui a navegação para a entidade Cliente
                .Where(c => c.Cliente != null && c.Cliente.UsuarioId == idUsuario) // Filtra com base no UsuarioId do Cliente
                .AsNoTracking() // Evita o rastreamento, melhorando a performance
                .ToList();

            // Se não houver cobranças, retorna uma lista vazia
            if (!cobrancas.Any())
            {
                return new List<CobrancaDTO>(); // Pode lançar exceção se for o caso
            }

            // Mapeia as cobranças para DTOs
            var cobrancasDTO = cobrancas.Select(c => new CobrancaDTO
            {
                Id = c.Id,
                Descricao = c.Descricao,
                Valor = c.Valor,
                Data = c.Data,
                Pago = c.Pago,
                ClienteId = c.ClienteId
            }).ToList();

            return cobrancasDTO;
        }

    public IEnumerable<CobrancaDTO> GetCobrancasByClienteId(Guid clienteId)
    {
        // Verifica se o clienteId é válido
        if (clienteId == Guid.Empty)
        {
            throw new ArgumentException("O ID do cliente não pode ser vazio.", nameof(clienteId));
        }

        // Obtém todas as cobranças relacionadas ao cliente especificado
        var cobrancas = _dbContext.Cobrancas
            .Where(c => c.ClienteId == clienteId) // Filtra por ClienteId
            .ToList(); // Executa a consulta

        // Mapeia as cobranças para DTOs e retorna a lista
        return cobrancas.Select(MapToDTO).ToList();
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

            _dbContext.Cobrancas.Add(cobranca); // Adiciona a cobrança ao contexto
            _dbContext.SaveChanges(); // Salva as mudanças no banco de dados

            return MapToDTO(cobranca);
        }

        
        public CobrancaDTO? UpdatePago(Guid id, bool pago)
        {
            // Busca a cobrança pelo ID
            var cobranca = _dbContext.Cobrancas.Find(id);
            
            // Verifica se a cobrança existe
            if (cobranca == null)
                return null;

            // Atualiza o status de pagamento
            cobranca.Pago = pago;

            // Salva as mudanças no banco de dados
            _dbContext.SaveChanges();

            // Retorna o DTO da cobrança atualizada
            return MapToDTO(cobranca);
        }
    
        public CobrancaDTO? UpdateCobranca(Guid id, CobrancaDTO cobrancaDTO)
        {
            var cobranca = _dbContext.Cobrancas.Find(id); // Busca a cobrança pelo ID
            if (cobranca == null)
                return null;

            cobranca.Descricao = cobrancaDTO.Descricao;
            cobranca.Valor = cobrancaDTO.Valor;
            cobranca.Data = cobrancaDTO.Data;
            cobranca.Pago = cobrancaDTO.Pago;
            cobranca.ClienteId = cobrancaDTO.ClienteId;

            _dbContext.SaveChanges(); // Salva as mudanças no banco de dados

            return MapToDTO(cobranca);
        }

        public bool DeleteCobranca(Guid id)
        {
            var cobranca = _dbContext.Cobrancas.Find(id); // Busca a cobrança pelo ID
            if (cobranca == null)
                return false;

            _dbContext.Cobrancas.Remove(cobranca); // Remove a cobrança do contexto
            _dbContext.SaveChanges(); // Salva as mudanças no banco de dados
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
                ClienteId = cobranca.ClienteId,
                
                Insert = cobranca.Insert.ToString("dd/MM/yyyy HH:mm"), 
                Update = cobranca.Update.ToString("dd/MM/yyyy HH:mm")
            };
        }
    }
}
