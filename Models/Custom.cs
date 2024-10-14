using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectLocalize.Models
{
  public abstract class Custom {
    [Column("_insert")]
    public DateTime Insert { get; private set; } // Setter privado

    [Column("_update")]
    public DateTime Update { get; set; } // Alterado para public

    public Custom() {
        Insert = DateTime.Now;
        Update = DateTime.Now;
    }

    public void SetInsertDate() {
        Insert = DateTime.Now; // Define a data de inserção
        Update = DateTime.Now; // Atualiza também a data de modificação
    }

    public void UpdateTimestamp() {
        Update = DateTime.Now; // Atualiza a data de modificação
    }
}

}
