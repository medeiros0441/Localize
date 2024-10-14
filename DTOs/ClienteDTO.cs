using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProjectLocalize.DTOs
{
    public class ClienteDTO :CustomDTO
    {
        [Required(ErrorMessage = "O Id do cliente é obrigatório.")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "O nome do cliente é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome pode ter no máximo 100 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "O documento do cliente é obrigatório.")]
        [StringLength(14, ErrorMessage = "O documento deve ter entre 11 e 14 caracteres.", MinimumLength = 11)]
        public string Documento { get; set; } = string.Empty;

        [Phone(ErrorMessage = "O telefone informado não é válido.")]
        public string Telefone { get; set; } = string.Empty;

        public string Endereco { get; set; } = string.Empty;

        [Required(ErrorMessage = "O Id do usuário é obrigatório.")]
        public Guid UsuarioId { get; set; }

        public List<CobrancaDTO> Cobrancas { get; set; } = new List<CobrancaDTO>();
    }
}
