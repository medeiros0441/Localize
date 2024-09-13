using System;

namespace ProjectLocalize.DTOs
{
    public class CobrancaDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();  
        public string Descricao { get; set; } = string.Empty;  
        public decimal Valor { get; set; } = 0.0m; 
        public DateTime Data { get; set; } = DateTime.Now;  
        public bool Pago { get; set; } = false;  
        public Guid ClienteId { get; set; } = Guid.Empty; 
    }
}
