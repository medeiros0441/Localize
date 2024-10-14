import axios from 'axios';
import { getCookie } from 'src/utils/storage';

// URL base configurável através de variáveis de ambiente
const BASE_URL = process.env.REACT_APP_API_URL || '/api/';
export default async function request(url, method = 'GET', data = null) {
  try {
      // Adiciona a barra no final da URL se não estiver presente
      const formattedUrl = url.endsWith('/') ? url : `${url}/`;
      const apiUrl = `${BASE_URL}${formattedUrl}`;

      // Obtém o token do cookie
      const token = getCookie('authToken');

      // Faz a requisição com axios
      const response = await axios({
          url: apiUrl,
          method,  // Método HTTP (GET, POST, etc.)
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Envia o token no cabeçalho
          },
          data, // Dados para POST ou PUT
          withCredentials: true, // Permite enviar cookies com a requisição
      });

      return { sucesso: true, ...response.data };
  } catch (error) {
      const errorMessage = getErrorMessage(error);
      return { sucesso: false, message: errorMessage };
  }
}


// Função para gerar a mensagem de erro
function getErrorMessage(error) {
  const errorMessages = {
    400: 'Solicitação inválida.',
    401: 'Não autorizado.',
    403: 'Acesso negado.',
    404: 'Recurso não encontrado.',
    500: 'Erro interno do servidor.',
  };

  if (error.response) {
    return error.response.data.message || errorMessages[error.response.status] || 'Erro na requisição.';
  } else if (error.request) {
    return 'Nenhuma resposta recebida do servidor.';
  } else {
    return error.message || 'Erro ao configurar a requisição.';
  }
}
