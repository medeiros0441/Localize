using ProjectLocalize.Data; // Inclua o namespace correto
using ProjectLocalize.DTOs;
using ProjectLocalize.Models;
using Microsoft.EntityFrameworkCore; // Para acesso a DbContext
using System;
using System.Collections.Generic;
using System.Linq;
using  ProjectLocalize.Services;
namespace ProjectLocalize.Services
{
    public class ClienteService
    {
        private readonly CobrancaService _cobrancaService;
        private readonly ApplicationDbContext _dbContext;

        public ClienteService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
            _cobrancaService = new CobrancaService(dbContext);
        }

        public ClienteDTO? GetClienteById(Guid id, Guid usuarioId)
        {
            // Busca cliente pelo ID e verifica se está relacionado ao UsuarioId
            var cliente = GetCliente(id, usuarioId);
            return cliente != null ? MapToDTO(cliente) : null;
        }

        public IEnumerable<ClienteDTO> GetAllClientes(Guid usuarioId) 
        {
            // Obtém todos os clientes relacionados ao UsuarioId
            var clientes = _dbContext.Clientes
                .Where(c => c.UsuarioId == usuarioId)
                .ToList();

            return clientes.Select(MapToDTO).ToList(); // Mapeia os dados após a consulta
        }

        public bool DocumentoExists(string documento, Guid? id_cliente = null)
        {
            // Verifica se existe algum cliente com o mesmo documento, ignorando o cliente atual
            return _dbContext.Clientes.Any(c => c.Documento == documento && c.Id != id_cliente);
        }

        public bool ClienteExists(Guid id)
        {
            // Verifica se existe um cliente com o ID fornecido
            return _dbContext.Clientes.Any(c => c.Id == id);
        }

        public bool TelefoneExists(string telefone, Guid? id_cliente = null)
        {
            // Verifica se existe algum cliente com o mesmo telefone, ignorando o cliente atual
            return _dbContext.Clientes.Any(c => c.Telefone == telefone && c.Id != id_cliente);
        }

        public bool IsUsuarioRelacionadoComCliente(Guid idUsuario, Guid idCliente)
        {
            var cliente = _dbContext.Clientes.Find(idCliente);
            if (cliente == null)
            {
                return false;
            }

            return cliente.UsuarioId == idUsuario;
        }

        public ClienteDTO CreateCliente(ClienteDTO clienteDTO)
        {
            var usuario = _dbContext.Usuarios.Find(clienteDTO.UsuarioId);
            if (usuario == null)
            {
                throw new Exception("Usuário não encontrado. Não é possível criar o cliente.");
            }

            var cliente = new Cliente
            {
                Id = Guid.NewGuid(), // Gera um novo Guid para o cliente
                Nome = clienteDTO.Nome,
                Documento = clienteDTO.Documento,
                Telefone = clienteDTO.Telefone,
                Endereco = clienteDTO.Endereco,
                UsuarioId = clienteDTO.UsuarioId // Relaciona com o usuário existente
            };

            _dbContext.Clientes.Add(cliente);
            _dbContext.SaveChanges(); // Salva as mudanças no banco de dados

            return MapToDTO(cliente);
        }

        public ClienteDTO? UpdateCliente(Guid id, ClienteDTO clienteDTO)
        {
            var cliente = GetCliente(id, clienteDTO.UsuarioId);
            if (cliente == null)
                return null;

            cliente.Nome = clienteDTO.Nome;
            cliente.Documento = clienteDTO.Documento;
            cliente.Telefone = clienteDTO.Telefone;
            cliente.Endereco = clienteDTO.Endereco;

            _dbContext.SaveChanges(); // Salva as mudanças no banco de dados

            return MapToDTO(cliente);
        }

        public bool DeleteCliente(Guid id, Guid usuarioId)
        {
            var cliente = GetCliente(id, usuarioId);
            if (cliente == null)
                return false;

            _dbContext.Clientes.Remove(cliente); // Remove o cliente do contexto
            _dbContext.SaveChanges(); // Salva as mudanças no banco de dados
            return true;
        }
        private Cliente GetCliente(Guid id, Guid usuarioId)
        {
            var cliente = _dbContext.Clientes
                .SingleOrDefault(c => c.Id == id && c.UsuarioId == usuarioId);

            if (cliente == null)
            {
                throw new KeyNotFoundException($"Cliente com ID {id} não encontrado ou não está relacionado ao usuário.");
            }

            return cliente;
        }


        private ClienteDTO MapToDTO(Cliente cliente)
        {
           var  cobrancasDTO = _cobrancaService.GetCobrancasByClienteId(cliente.Id).ToList();;
               

            return new ClienteDTO
            {
                Id = cliente.Id,
                Nome = cliente.Nome,
                Documento = cliente.Documento,
                Telefone = cliente.Telefone,
                Endereco = cliente.Endereco,
                UsuarioId = cliente.UsuarioId,
                Cobrancas = cobrancasDTO,  
                Insert = cliente.Insert.ToString("dd/MM/yyyy HH:mm"),
                Update = cliente.Update.ToString("dd/MM/yyyy HH:mm")
            };
        }
 
    }
}
