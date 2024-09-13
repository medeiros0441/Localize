using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectLocalize.Models
{
    public class Cobranca
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(255)]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Valor { get; set; } = 0.01m;

        [Required]
        public DateTime Data { get; set; } = DateTime.Now;

        [Required]
        public bool Pago { get; set; } = false;

        // Foreign Key para a entidade Cliente
        [ForeignKey("Cliente")]
        public Guid ClienteId { get; set; } = Guid.Empty;
        public Cliente? Cliente { get; set; } // Permitir nulo
    }
}
