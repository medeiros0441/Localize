using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;

namespace ProjectLocalize.Utils
{
    public class TokenManager
    {
        private readonly string _secretKey;
        private readonly int _expiryInMinutes;
        private readonly string _issuer;
        private readonly string _audience;

        public TokenManager(IConfiguration configuration)
        {
            // Aqui você obtém os valores diretamente do IConfiguration
            _secretKey = configuration["Jwt:SecretKey"] ?? throw new InvalidOperationException("SecretKey não está configurado.");
            _expiryInMinutes = int.TryParse(configuration["Jwt:ExpiryInMinutes"], out var expiry) ? expiry : 60; // Defina um valor padrão
            _issuer = configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Issuer não está configurado.");
            _audience = configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Audience não está configurado.");
        }

        public string GenerateToken(ClaimsIdentity identity)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: identity.Claims,
                expires: DateTime.Now.AddMinutes(_expiryInMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public void ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey)),
                ValidateIssuer = true,
                ValidIssuer = _issuer,
                ValidateAudience = true,
                ValidAudience = _audience,
                ValidateLifetime = true
            };

            tokenHandler.ValidateToken(token, validationParameters, out _);
        }

        public ClaimsPrincipal DecodificarToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey)),
                ValidateIssuer = true,
                ValidIssuer = _issuer,
                ValidateAudience = true,
                ValidAudience = _audience,
                ValidateLifetime = true
            };

            // Decodifica e valida o token
            var principal = handler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

            return principal;
        }

    }
}
