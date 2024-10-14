using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // Importar para validação

namespace ProjectLocalize.DTOs
{
    public class UsuarioDTO  :CustomDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public List<ClienteDTO> Clientes { get; set; } = new List<ClienteDTO>();
    }
}
