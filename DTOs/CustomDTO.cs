using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ProjectLocalize.Models;
using System;

namespace ProjectLocalize.DTOs
{
    public abstract class CustomDTO
    {
        public string Insert { get; set; }
        public string Update { get; set; }

        // Construtor vazio
        protected CustomDTO()
        {
            // Defina valores padrão ou atribua um valor seguro às propriedades
            Insert = DateTime.Now.ToString("dd/MM/yyyy HH:mm"); // Data atual
            Update = DateTime.Now.ToString("dd/MM/yyyy HH:mm");
        }

        // Construtor que aceita um CustomModel para converter o modelo em DTO
        protected CustomDTO(Custom model)
        {
            Insert = model.Insert.ToString("dd/MM/yyyy HH:mm"); // Formato brasileiro
            Update = model.Update.ToString("dd/MM/yyyy HH:mm");
        }
    }
}
