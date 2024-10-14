import { CobrancaInterface } from '@interface'; // Interface para Cobranca
import request from '@utils/api';  

class CobrancaService {
    // Método para obter uma cobrança pelo ID
    static async getCobrancaById(id) {
        const response = await request(`cobranca/${id}`, 'GET');
        if (response.sucesso) {
            response.cobranca = CobrancaInterface.fromApiResponse(response.data);
        } else {
            response.cobranca = null; // Define como null se não for bem-sucedido
        }
        return response; // Retorna a resposta original
    }

    // Método para obter todas as cobranças
    static async getAllCobrancas() {
        const response = await request('cobranca', 'GET');
        if (response.sucesso) {
            response.cobrancas = response.data.map(cobranca => CobrancaInterface.fromApiResponse(cobranca));
        } else {
            response.cobrancas = []; // Define como array vazio se houver erro
        }
        return response; // Retorna a resposta original
    }

    // Método para criar uma nova cobrança
    static async createCobranca(cobrancaDTO) {
        try {
            const response = await request('cobranca', 'POST', cobrancaDTO);
            // Verifica se a resposta foi bem-sucedida
            if (response.sucesso) {
                // Mapeia a cobrança da resposta para a interface
                response.cobranca = CobrancaInterface.fromApiResponse(response.data);
            } else {
                response.cobranca = null; // Define como null se não for bem-sucedido
            }
            return response; // Retorna a resposta original
        } catch (error) {
            // Lida com erros que possam ocorrer durante a requisição
            console.error('Erro ao criar cobrança:', error);
            return {
                sucesso: false,
                message: 'Erro ao criar cobrança.',
                cobranca: null
            };
        }
    }

    // Método para atualizar uma cobrança existente
    static async updateCobranca(id, cobrancaDTO) {
        const response = await request(`cobranca/${id}`, 'PUT', cobrancaDTO);
        if (response.sucesso) {
            response.cobranca = CobrancaInterface.fromApiResponse(response.data);
        } else {
            response.cobranca = null; // Define como null se não for bem-sucedido
        }
        return response; // Retorna a resposta original
    }

    // Método para atualizar o status de pagamento
    static async updatePago(id, pago) {
        // Certifique-se de que 'pago' é um booleano
        const response = await request(`cobranca/${id}/pago`, 'PUT', pago );
        if (response.sucesso) {
            response.cobranca = CobrancaInterface.fromApiResponse(response.data);
        } else {
            response.cobranca = null; // Define como null se não for bem-sucedido
        }
        return response; // Retorna a resposta original
    }


    // Método para excluir uma cobrança
    static async deleteCobranca(id) {
        const response = await request(`cobranca/${id}`, 'DELETE');
        return response;  
    }
}

export default CobrancaService;
