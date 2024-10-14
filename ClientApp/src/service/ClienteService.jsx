import ClienteInterface from '@interface/ClienteInterface'; 
import request from '@utils/api';  

export default class ClienteService {
    // Método para obter um cliente pelo ID
    static async getClienteById(id) {
        const response = await request(`cliente/${id}`, 'GET');
        if (response.sucesso) {
            response.cliente = ClienteInterface.fromApiResponse(response.data);
        } else {
            response.cliente = null; // Se não for bem-sucedido, define como null
        }
        return response; // Retorna a resposta original
    }

    // Método para obter todos os clientes
    static async getAllClientes() {
        const response = await request('cliente', 'GET');
        if (response.sucesso) {
            response.clientes = response.data.map(cliente => ClienteInterface.fromApiResponse(cliente));
        } else {
            response.clientes = []; // Define como array vazio se houver erro
        }
        return response; // Retorna a resposta original
    }

    // Método para criar um novo cliente
    static async createCliente(clienteDTO) {
        const response = await request('cliente', 'POST', clienteDTO);
        if (response.sucesso) {
            response.cliente = ClienteInterface.fromApiResponse(response.data);
        } else {
            response.cliente = null; // Define como null se não for bem-sucedido
        }
        return response; // Retorna a resposta original
    }

    // Método para atualizar um cliente existente
    static async updateCliente(id, clienteDTO) {
        const response = await request(`cliente/${id}`, 'PUT', clienteDTO);
        if (response.sucesso) {
            response.cliente = ClienteInterface.fromApiResponse(response.data);
        } else {
            response.cliente = null; // Define como null se não for bem-sucedido
        }
        return response; // Retorna a resposta original
    }

    // Método para excluir um cliente
    static async deleteCliente(id) {
        const response = await request(`cliente/${id}`, 'DELETE');
        return response; // Retorna a resposta original
    }
}
