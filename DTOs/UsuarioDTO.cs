using System;
using System.Collections.Generic;

namespace ProjectLocalize.DTOs
{
    public class UsuarioDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public List<ClienteDTO> Clientes { get; set; } = new List<ClienteDTO>();
    }
}
