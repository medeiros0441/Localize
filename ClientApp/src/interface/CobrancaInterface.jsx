import CustomInterface from './CustomInterface';
export default class CobrancaInterface extends CustomInterface {
    constructor(data = {}) {
        // Chamando o construtor da classe base e convertendo as chaves para minúsculas
        super(data);
        const formattedData = this.convertKeysToLowercase(data);

        // Inicializações específicas para CobrancaInterface com chaves minúsculas
        this.id = formattedData.id || '';
        this.descricao = formattedData.descricao || '';
        this.valor = this.convertAndFormatValue(formattedData.valor || 0.0); // Processa o valor baseado no tipo
        this.data = formattedData.data ? new Date(formattedData.data) : new Date(); // Data padrão para o campo 'data'
        this.pago = formattedData.pago || false;
        this.clienteId = formattedData.clienteid || ''; // Certifique-se de que a chave esteja correta
    }

    // Método para converter e formatar o valor baseado no tipo
    convertAndFormatValue(value) {
        if (typeof value === 'string') {
            return value;  
        }  else if (typeof value === 'number') {
            if (!value) {
                return '0,00'; // Valor padrão se não houver entrada
            }
            
            // Verifica se o valor é um número
            if (typeof value === 'number') {
                return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            
            return '0,00'; // Valor padrão
        }
    }

    
    static fromApiResponse(data) {
        return new CobrancaInterface(data);
    }

    // Converte os valores para o payload da API com chaves apropriadas
    toApiPayload() {
        return {
            id: this.processValue(this.id, 'guild'),  // Simulando o tipo Guid em JavaScript
            descricao: this.processValue(this.descricao, String),  // Simulando string
            valor: this.processValue(this.valor, 'decimal'),  // Formato adequado para envio
            data: this.processValue(this.data, Date),  // Simulando DateTime
            pago: this.processValue(this.pago, Boolean),  // Simulando bool
            clienteid: this.processValue(this.clienteId, 'guild'),  // Simulando Guid
        };
    }
}
