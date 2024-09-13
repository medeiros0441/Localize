import axios from 'axios';

// Função genérica para fazer requisições API
export default async function request(url, method = 'GET', data = null) {
  try {
    // Adiciona a barra no final da URL se não estiver presente
    const formattedUrl = url.endsWith('/') ? url : `${url}/`;
    const apiUrl = `/api/${formattedUrl}`;  // Corrige a variável para a URL

    const response = await axios({
      url: apiUrl,              // URL da API
      method,                   // Método HTTP
      headers: {
        'Content-Type': 'application/json',  // Tipo de conteúdo JSON
      },
      data,                     // Dados para o método POST ou PUT
    });
    return { success: true, ...response.data };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return { success: false, message: errorMessage };
  }
}


// Função para gerar a mensagem de erro
function getErrorMessage(error) {
  if (error.response) {
    // A resposta da API contém informações sobre o erro
    switch (error.response.status) {
      case 400:
        return error.response.data.message || 'Solicitação inválida.';
      case 401:
        return error.response.data.message || 'Não autorizado.';
      case 403:
        return error.response.data.message || 'Acesso negado.';
      case 404:
        return error.response.data.message || 'Recurso não encontrado.';
      case 500:
        return error.response.data.message || 'Erro interno do servidor.';
      default:
        return error.response.data.message || 'Erro na requisição.';
    }
  } else if (error.request) {
    // A requisição foi feita, mas não houve resposta
    return 'Nenhuma resposta recebida do servidor.';
  } else {
    // Outro erro ocorreu ao configurar a requisição
    return error.message || 'Erro ao configurar a requisição.';
  }
}