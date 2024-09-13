using ProjectLocalize.DTOs;
using ProjectLocalize.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;

namespace ProjectLocalize.Services
{
    public class UsuarioService
    {
        private readonly List<Usuario> _usuarios = new List<Usuario>();
        private readonly PasswordHasher<Usuario> _passwordHasher = new PasswordHasher<Usuario>();

        public UsuarioDTO CreateUsuario(UsuarioDTO usuarioDTO)
        {
            var usuario = new Usuario
            {
                Id = Guid.NewGuid(),
                Nome = usuarioDTO.Nome,
                Email = usuarioDTO.Email,
                Senha = _passwordHasher.HashPassword(new Usuario(), usuarioDTO.Senha) // Passar um usuário fictício
            };

            _usuarios.Add(usuario);
            return MapToDTO(usuario);
        }
        public UsuarioDTO? Authenticate(string email, string senha)
        {
            var usuario = _usuarios.FirstOrDefault(u => u.Email == email);
            if (usuario == null || _passwordHasher.VerifyHashedPassword(usuario, usuario.Senha, senha) != PasswordVerificationResult.Success)
            {
                return null; // Autenticação falhou
            }

            return MapToDTO(usuario);
        }

        public UsuarioDTO? GetUsuarioById(Guid id)
        {
            var usuario = _usuarios.FirstOrDefault(u => u.Id == id);
            return usuario != null ? MapToDTO(usuario) : null;
        }

        public IEnumerable<UsuarioDTO> GetAllUsuarios()
        {
            return _usuarios.Select(u => MapToDTO(u));
        }

        public UsuarioDTO? UpdateUsuario(Guid id, UsuarioDTO usuarioDTO)
        {   
            var usuario = _usuarios.FirstOrDefault(u => u.Id == id);
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

            return MapToDTO(usuario);
        }

        public bool DeleteUsuario(Guid id)
        {
            var usuario = _usuarios.FirstOrDefault(u => u.Id == id);
            if (usuario == null)
                return false;

            _usuarios.Remove(usuario);
            return true;
        }

        private UsuarioDTO MapToDTO(Usuario usuario)
        {
            return new UsuarioDTO
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email
            };
        }
    }
}
