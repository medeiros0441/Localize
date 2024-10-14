using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Security.Claims;
using System.Linq;

using Microsoft.AspNetCore.Authorization;
namespace ProjectLocalize.Utils
{
    public class CustomAuthorizationFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            // Verifica se a ação ou o controlador tem o atributo AllowAnonymous
            var allowAnonymous = context.ActionDescriptor.EndpointMetadata
                .OfType<AllowAnonymousAttribute>()
                .Any();

            // Se AllowAnonymous está presente, não faz nada e permite a execução da ação
            if (allowAnonymous)
            {
                return; // Permite que a ação seja executada sem autorização
            }

            // Extraia o ID do usuário do contexto
            var userIdClaim = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Verifica se o ID do usuário é válido
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId) || userId == Guid.Empty)
            {
                context.Result = new UnauthorizedObjectResult(new
                {
                    success = false,
                    message = "Usuário não autorizado."
                });
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Lógica pós-execução (se necessário)
        }
    }
}
