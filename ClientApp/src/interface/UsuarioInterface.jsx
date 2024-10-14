import CustomInterface from './CustomInterface';

export default class UsuarioInterface extends CustomInterface {
    constructor(data = {}) {
        // Chamando o construtor da classe base para inicializar 'created' e 'updated'
        super(data);

        // Inicializações específicas para UsuarioInterface
        const formattedData = this.convertKeysToLowercase(data); // Converte as chaves para minúsculas

        this.id = formattedData.id || '';
        this.nome = formattedData.nome || '';
        this.email = formattedData.email || '';
        this.senha = formattedData.senha || '';
        this.clientes = Array.isArray(formattedData.clientes) ? formattedData.clientes : []; // Lista de clientes associados ao usuário
    }

    static fromApiResponse(data) {
        return new UsuarioInterface(data);
    }

    toApiPayload() {
        return {
            ...super.toApiPayload(), // Inclui 'created' e 'updated' da classe base
            id : this.id,
            nome: this.nome,
            email: this.email,
            senha: this.senha,
            clientes: this.clientes,
        };
    }
}
