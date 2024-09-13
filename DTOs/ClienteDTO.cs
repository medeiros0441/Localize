using System;
using System.Collections.Generic;

namespace ProjectLocalize.DTOs
{
    public class ClienteDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Nome { get; set; } = string.Empty;
        public string Documento { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public Guid UsuarioId { get; set; }
        public List<CobrancaDTO> Cobrancas { get; set; } = new List<CobrancaDTO>();
    }
}
