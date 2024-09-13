using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectLocalize.Models
{
    public class Cliente
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(255)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [StringLength(14)]
        public string Documento { get; set; } = string.Empty;

        [Required]
        [StringLength(15)]
        public string Telefone { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Endereco { get; set; } = string.Empty;

        // Relacionamento um para muitos com Cobranca
        public ICollection<Cobranca> Cobrancas { get; set; } = new List<Cobranca>();

        // FK para o relacionamento com Usuario
        [ForeignKey("Usuario")]
        public Guid UsuarioId { get; set; } = Guid.Empty;
        public Usuario? Usuario { get; set; } // Permitir nulo
    }
}
