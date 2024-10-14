using ProjectLocalize.Data; // Certifique-se de incluir o namespace correto
using ProjectLocalize.DTOs;
using ProjectLocalize.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjectLocalize.Services
{
    public class UsuarioService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly PasswordHasher<Usuario> _passwordHasher = new PasswordHasher<Usuario>();

        public UsuarioService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool EmailExiste(string email)
        {
            // Verifica se já existe um usuário com o email fornecido
            return _dbContext.Usuarios.Any(u => u.Email == email);
        }
        // Método para verificar se o usuário existe pelo ID
        public bool UsuarioExists(Guid id)
        {
            return _dbContext.Usuarios.Any(u => u.Id == id);
        }
        public UsuarioDTO CreateUsuario(UsuarioDTO usuarioDTO)
        {
            // Verifica se o e-mail já está cadastrado
            if (EmailExiste(usuarioDTO.Email))
            {
                throw new ArgumentException("E-mail já cadastrado. Por favor, use outro e-mail.");
            }

            // Cria um novo objeto Usuario
            var usuario = new Usuario
            {
                Id = Guid.NewGuid(),
                Nome = usuarioDTO.Nome,
                Email = usuarioDTO.Email,
                Senha = _passwordHasher.HashPassword(new Usuario(), usuarioDTO.Senha) // Hasheia a senha
            };

            // Adiciona o novo usuário ao contexto e salva as mudanças
            _dbContext.Usuarios.Add(usuario);
            _dbContext.SaveChanges();

            // Retorna o DTO do usuário criado
            return MapToDTO(usuario);
        }

        public UsuarioDTO? Authenticate(string email, string senha)
        {
            try
            {
                var usuario = _dbContext.Usuarios.FirstOrDefault(u => u.Email == email);
                
                // Verifica se o usuário existe e se a senha está correta
                if (usuario == null || _passwordHasher.VerifyHashedPassword(usuario, usuario.Senha, senha) != PasswordVerificationResult.Success)
                {
                    return null; // Autenticação falhou
                }

                return MapToDTO(usuario);
            }
            catch (Exception ex)
            {
                // Log ou manipulação de erro apropriada
                Console.WriteLine($"Error during authentication: {ex.Message}");
                return null; // Retorna null em caso de erro
            }
        }

        public UsuarioDTO? GetUsuarioById(Guid id)
        {
            var usuario = _dbContext.Usuarios.Find(id); // Usa Find para buscar pelo ID
            return usuario != null ? MapToDTO(usuario) : null;
        }

        public IEnumerable<UsuarioDTO> GetAllUsuarios()
        {
            return _dbContext.Usuarios.Select(u => MapToDTO(u)).ToList(); // Executa a consulta e transforma em lista
        }

        public UsuarioDTO? UpdateUsuario(Guid id, UsuarioDTO usuarioDTO)
        {   
            var usuario = _dbContext.Usuarios.Find(id);
            if (usuario == null)
                return null;

            // Atualiza outros dados do usuário
            usuario.Nome = usuarioDTO.Nome;
            usuario.Email = usuarioDTO.Email;

            // Se a senha for fornecida, atualize a senha com hash
            if (!string.IsNullOrEmpty(usuarioDTO.Senha))
            {
                usuario.Senha = _passwordHasher.HashPassword(usuario, usuarioDTO.Senha);
            }

            // Salva as mudanças no banco de dados
            _dbContext.SaveChanges();

            return MapToDTO(usuario);
        }

        public bool DeleteUsuario(Guid id)
        {
            var usuario = _dbContext.Usuarios.Find(id);
            if (usuario == null)
                return false;

            _dbContext.Usuarios.Remove(usuario);
            _dbContext.SaveChanges();
            return true;
        }

        private UsuarioDTO MapToDTO(Usuario usuario)
        {
            return new UsuarioDTO
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Insert = usuario.Insert.ToString("dd/MM/yyyy HH:mm"), 
                Update = usuario.Update.ToString("dd/MM/yyyy HH:mm")
            };
        }
    }
}
