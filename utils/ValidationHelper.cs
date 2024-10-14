using System;
using System.Net.Mail;

namespace ProjectLocalize.Utils
{
    public static class ValidationHelper
    {
        // Verifica se um e-mail é válido
        public static bool IsValidEmail(string email)
        {
            try
            {
                var addr = new MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        // Verifica se uma string é nula ou vazia
        public static bool IsNullOrEmpty(string value)
        {
            return string.IsNullOrEmpty(value);
        }

        // Verifica se uma senha atende a requisitos mínimos
        public static bool IsValidPassword(string password)
        {
            // Exemplo: a senha deve ter pelo menos 8 caracteres e incluir um número
            return !string.IsNullOrEmpty(password) && password.Length >= 8 && 
                   password.Any(char.IsDigit);
        }

        // Verifica se uma string contém apenas letras
        public static bool IsAlphabetic(string value)
        {
            return !string.IsNullOrEmpty(value) && value.All(char.IsLetter);
        }
    }
}
