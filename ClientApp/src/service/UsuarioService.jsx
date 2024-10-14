import { UsuarioInterface } from '@interface';
import request from '@utils/api';  

class UsuarioService {
    // Método para obter um usuário pelo ID
    static async getUsuarioById(id) {
        const response = await request(`usuarios/${id}`, 'GET');
        if (response.sucesso) {
            response.usuario = UsuarioInterface.fromApiResponse(response.data);
        } else {
            response.usuario = null; // Define como null se não for bem-sucedido
        }
        return response; // Retorna a resposta original
    }

    // Método para obter todos os usuários
    static async getAllUsuarios() {
        const response = await request('usuarios', 'GET');
        if (response.sucesso) {
            response.usuarios = response.data.map(usuario => UsuarioInterface.fromApiResponse(usuario));
        } else {
            response.usuarios = []; // Define como array vazio se houver erro
        }
        return response; // Retorna a resposta original
    }

    // Método para registrar um novo usuário
    static async register(usuarioDTO) {
        const response = await request('usuarios/register', 'POST', usuarioDTO);
        if (response.sucesso) {
            response.usuario = UsuarioInterface.fromApiResponse(response.data);
        } else {
            response.usuario = null; // Define como null se não for bem-sucedido
        }
        return response; // Retorna a resposta original
    }

    // Método para atualizar um usuário existente
    static async updateUsuario(id, usuarioDTO) {
        const response = await request(`usuarios/${id}`, 'PUT', usuarioDTO);
        if (response.sucesso) {
            response.usuario = UsuarioInterface.fromApiResponse(response.data);
        } else {
            response.usuario = null; // Define como null se não for bem-sucedido
        }
        return response; // Retorna a resposta original
    }

    // Método para excluir um usuário
    static async deleteUsuario(id) {
        const response = await request(`usuarios/${id}`, 'DELETE');
        return response; // Retorna a resposta original
    }
}

export default UsuarioService;
