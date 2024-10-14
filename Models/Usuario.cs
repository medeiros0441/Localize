using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProjectLocalize.Models
{
    public class Usuario : Custom
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(255)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Senha { get; set; } = string.Empty;

        // Relacionamento um para muitos com Cliente
        public ICollection<Cliente> Clientes { get; set; } = new List<Cliente>();
    }
}
