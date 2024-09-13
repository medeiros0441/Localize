using ProjectLocalize.DTOs;
using ProjectLocalize.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjectLocalize.Services
{
    public class ClienteService
    {
        private readonly List<Cliente> _clientes = new List<Cliente>();

        public ClienteDTO? GetClienteById(Guid id)
        {
            var cliente = _clientes.FirstOrDefault(c => c.Id == id);
            return cliente != null ? MapToDTO(cliente) : null;
        }

        public IEnumerable<ClienteDTO> GetAllClientes()
        {
            return _clientes.Select(c => MapToDTO(c));
        }

        public ClienteDTO CreateCliente(ClienteDTO clienteDTO)
        {
            var cliente = new Cliente
            {
                Id = Guid.NewGuid(),
                Nome = clienteDTO.Nome,
                Documento = clienteDTO.Documento,
                Telefone = clienteDTO.Telefone,
                Endereco = clienteDTO.Endereco,
                UsuarioId = clienteDTO.UsuarioId // Relacionamento com Usuario
            };

            _clientes.Add(cliente);
            return MapToDTO(cliente);
        }

        public ClienteDTO? UpdateCliente(Guid id, ClienteDTO clienteDTO)
        {
            var cliente = _clientes.FirstOrDefault(c => c.Id == id);
            if (cliente == null)
                return null;

            cliente.Nome = clienteDTO.Nome;
            cliente.Documento = clienteDTO.Documento;
            cliente.Telefone = clienteDTO.Telefone;
            cliente.Endereco = clienteDTO.Endereco;
            cliente.UsuarioId = clienteDTO.UsuarioId; 

            return MapToDTO(cliente);
        }

        public bool DeleteCliente(Guid id)
        {
            var cliente = _clientes.FirstOrDefault(c => c.Id == id);
            if (cliente == null)
                return false;

            _clientes.Remove(cliente);
            return true;
        }

        private ClienteDTO MapToDTO(Cliente cliente)
        {
            return new ClienteDTO
            {
                Id = cliente.Id,
                Nome = cliente.Nome,
                Documento = cliente.Documento,
                Telefone = cliente.Telefone,
                Endereco = cliente.Endereco,
                UsuarioId = cliente.UsuarioId // Inclui a FK para Usuario
            };
        }
    }
}
