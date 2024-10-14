export default class CustomInterface {
    constructor(data = {}) {
        // Inicializa as propriedades comuns 'Insert' e 'Update'
        this.insert = data.insert || null;  // Data de criação
        this.update = data.update || null;  // Data de última atualização
    }

    // Método que transforma a instância da interface no formato para ser enviado à API
    toApiPayload() {
        return {
            Insert: this.insert ? this.insert.toISOString() : null,  // Converte a data para o formato ISO
            Update: this.update ? this.update.toISOString() : null,  // Converte a data para o formato ISO
        };
    }

    // Método que processa o valor com base no tipo
    processValue(value, type) {
        switch (type) {
            case String:
                return String(value);

            case 'decimal':
                return this.processDecimal(value);

            case Date:
                return new Date(value).toISOString(); // Converte a data para o formato ISO

            case Boolean:
                return Boolean(value); // Converte para booleano

            case 'guid':
                return value.toString(); // Garante que é uma string de GUID

            default:
                return value; // Retorna o valor inalterado para tipos desconhecidos
        }
    }

    // Processa valores decimais e formata conforme necessário (ex. para o backend)
    processDecimal(value) {
        if (value) {
            // Remove espaços e pontos (separadores de milhar) e substitui a vírgula por ponto
            // Remove os pontos (separadores de milhar) e substitui a vírgula por ponto
            const cleanedValue = value.trim().replace(/\./g, '').replace(',', '.');
            const numericValue = parseFloat(cleanedValue);
            // Verifica se o valor é um número válido
            return isNaN(numericValue) ? '0.00' : numericValue.toFixed(2);
        }
        return '0.00'; // Valor padrão se não houver entrada
    }

    // Método para formatar o valor monetário para exibição no frontend
    processValueForDisplay(value) {
        if (!value) return '0,00';

        const numericValue = parseFloat(value);
        return !isNaN(numericValue)
            ? numericValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : '0,00';
    }

    // Método privado para formatar a data no formato brasileiro (DD/MM/YYYY HH:mm)
    formatDate(date) {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Para usar o formato de 24 horas
        };
        return new Intl.DateTimeFormat('pt-BR', options).format(date);
    }

    // Método genérico para converter todas as chaves de um objeto para minúsculas
    convertKeysToLowercase(data) {
        return Object.keys(data).reduce((acc, key) => {
            acc[key.toLowerCase()] = data[key];
            return acc;
        }, {});
    }
}
