using Microsoft.EntityFrameworkCore;
using ProjectLocalize.Models;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ProjectLocalize.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            // Inicializa as propriedades para evitar o aviso CS8618
            Usuarios = Set<Usuario>();
            Clientes = Set<Cliente>();
            Cobrancas = Set<Cobranca>();
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Cobranca> Cobrancas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurações adicionais para as entidades
            modelBuilder.Entity<Usuario>()
                .HasKey(u => u.Id); // Define a chave primária para a entidade Usuario

            modelBuilder.Entity<Cliente>()
                .Property(c => c.Nome)
                .IsRequired()
                .HasMaxLength(100); // Define que o nome do cliente é obrigatório e tem no máximo 100 caracteres

            // Outras configurações podem ser adicionadas aqui
        }

        public override int SaveChanges()
        {
            // Trata as datas de criação e atualização antes de salvar
            SetEntityDates();

            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // Trata as datas de criação e atualização antes de salvar
            SetEntityDates();

            return base.SaveChangesAsync(cancellationToken);
        }

       private void SetEntityDates() 
       {
            var entities = ChangeTracker.Entries()
                .Where(e => e.Entity is Custom && (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entity in entities) {
                var customEntity = (Custom)entity.Entity;

                if (entity.State == EntityState.Added) {
                    customEntity.SetInsertDate(); // Define a data de inserção
                }

                customEntity.UpdateTimestamp(); // Atualiza a data de modificação
            }
        }

    }
}
