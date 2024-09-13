using Microsoft.EntityFrameworkCore;
using ProjectLocalize.Models;

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
    }
}