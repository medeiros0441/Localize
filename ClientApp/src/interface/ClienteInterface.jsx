import CustomInterface from './CustomInterface';
import CobrancaInterface from './CobrancaInterface';

export default class ClienteInterface extends CustomInterface {
    constructor(data = {}) {
        super(data);  // Chama o construtor da CustomInterface para inicializar 'Created' e 'Updated'

        // Inicializações específicas para ClienteInterface
        const formattedData = this.convertKeysToLowercase(data); // Converte as chaves para minúsculas

        this.id = formattedData.id || '';  // UUID do cliente
        this.nome = formattedData.nome || '';  // Nome do cliente
        this.documento = formattedData.documento || '';  // Documento do cliente (CPF/CNPJ)
        this.telefone = formattedData.telefone || '';  // Telefone do cliente
        this.endereco = formattedData.endereco || '';  // Endereço do cliente
        this.usuarioId = formattedData.usuarioid || '';  // UUID do usuário relacionado a esse cliente

        // Inicializa a lista de cobranças
        this.cobrancas = this.initializeCobrancas(formattedData.cobrancas);
    }

    // Método privado para inicializar a lista de cobranças
    initializeCobrancas(cobrancasData) {
        return Array.isArray(cobrancasData) 
            ? cobrancasData.map(cobranca => new CobrancaInterface(cobranca))
            : [];  // Retorna uma lista vazia se não for um array
    }

    static fromApiResponse(data) {
        return new ClienteInterface(data);
    }

    // Método para preparar os dados para enviar à API
    toApiPayload() {
        return {
            ...super.toApiPayload(),  // Inclui 'Created' e 'Updated' da CustomInterface
            id: this.id,
            nome: this.nome,
            documento: this.documento,
            telefone: this.telefone,
            endereco: this.endereco,
            usuarioid: this.usuarioId,  // Use a chave em minúsculas
            cobrancas: this.cobrancas.map(cobranca => cobranca.toApiPayload()),  // Converte cada cobrança para o formato de payload
        };
    }
}
