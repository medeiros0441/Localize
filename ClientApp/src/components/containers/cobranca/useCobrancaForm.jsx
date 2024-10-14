import React, { useState, useEffect, useCallback } from 'react';
import Input from '@objetos/Input';
import Label from '@objetos/Label';
import InputSearch from '@objetos/InputSearch';
import Select from '@objetos/Select';
import { CobrancaService, ClienteService } from '@service';
import alerta from '@utils/alerta';
import { CobrancaInterface } from '@interface';
import loading from '@utils/loading'
const useCobrancaForm = (id, isEditable, id_cliente_select = null) => {
  const showMessage = (message, type) => alerta(message, type);
  const setloading = (status) => loading(status, 'id_formulario_loading');
  const [formValues, setFormValues] = useState({
    id: '',
    descricao: '',
    valor: '',
    data: '',
    pago: '',
    clienteId: '',
  });

  const [cobranca, setCobranca] = useState({});
  const [clientes, setClientes] = useState([]);
  const [id_cliente, setIdCliente] = useState(id_cliente_select);
  const [cliente, setCliente] = useState(null);
  const [clienteNome, setClienteNome] = useState('');
// Refatoração: combinando a lógica de fetch de clientes e cobrança
const fetchData = useCallback(async () => {
  setloading(true);

  try {
    let responseCobranca = null; // Inicializa a variável fora do escopo condicional

    // Buscando a cobrança se o ID existir
    if (id) {
      try {
        // Realiza a chamada à API para obter a cobrança
        responseCobranca = await CobrancaService.getCobrancaById(id);

        // Verifica se a resposta foi bem-sucedida
        if (responseCobranca?.sucesso) {
          setFormValues(responseCobranca.cobranca);
          setCobranca(responseCobranca.cobranca);
          setIdCliente(responseCobranca.cobranca.clienteId);
        } else {
          showMessage(responseCobranca?.message || "Erro desconhecido ao obter cobrança", 2);
          return;
        }
      } catch (error) {
        // Captura qualquer erro que ocorra na requisição
        console.error("Erro ao buscar cobrança:", error);
        showMessage("Erro ao buscar cobrança", 2);
        return;
      }
    }

    // Buscando clientes
    const responseClientes = await ClienteService.getAllClientes();
    if (responseClientes?.sucesso) {
      setClientes(responseClientes.clientes);

      // Determina o cliente selecionado
      const clienteId = id_cliente || responseCobranca?.cobranca?.clienteId;
      if (clienteId) {
        const foundCliente = responseClientes.clientes.find(cliente => cliente.id === clienteId);
        setCliente(foundCliente);
        setClienteNome(foundCliente ? foundCliente.nome : '');
        setFormValues(prevValues => ({
          ...prevValues,
          clienteId: foundCliente ? foundCliente.id : '',
        }));
      }
    } else {
      showMessage(responseClientes?.message || "Erro desconhecido ao buscar clientes", 2);
    }
  } catch (error) {
    // Captura erros gerais
    console.error("Erro ao buscar dados:", error);
    showMessage('Erro ao buscar dados', 2);
  }
  finally{
  setloading(false);
  }
}, [id, id_cliente]);



  useEffect(() => {
    fetchData();
  }, [id, fetchData]);

  // Restante da lógica permanece igual
  const formatarValor = (value) => {
    // Remove tudo que não é dígito
    const apenasNumeros = value.replace(/[^\d]/g, '');

    // Retorna string vazia se não houver números
    if (!apenasNumeros) return '';

    // Obtém a parte decimal (últimos 2 dígitos) e a parte inteira (restante)
    let parteDecimal = apenasNumeros.slice(-2); // Últimos 2 dígitos como parte decimal
    let parteInteira = apenasNumeros.slice(0, -2); // Resto como parte inteira

    // Formata a parte inteira para incluir separadores de milhar
    parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Se a parte inteira estiver vazia, mostra apenas a parte decimal
    // Formata o valor final no estilo brasileiro
    const valorFormatado = `${parteInteira}${parteInteira.length > 0 ? ',' : ''}${parteDecimal}`;

    return valorFormatado; // Retorna o valor formatado
};

  const validatePayload = ({ descricao, valor, data, clienteId }) => {
    const errors = [];
    if (!descricao.trim()) errors.push('Descrição da cobrança é obrigatória.');
    if (valor <= 0) errors.push('O valor deve ser maior que zero.');
    if (!data || isNaN(new Date(data).getTime())) errors.push('Data é obrigatória e deve ser válida.');
    if (!clienteId.trim()) errors.push('Cliente não foi selecionado. É obrigatório.');
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validatePayload(formValues);
    if (errors.length > 0) {
      showMessage(`Erro:\n${errors.join('\n')}`, 2);
      return;
    }

    const cobranca = new CobrancaInterface(formValues);
    const valuesToSubmit = id
      ? cobranca.toApiPayload()
      : (({ id, ...rest }) => rest)(cobranca.toApiPayload());

    try {
      const response = id
        ? await CobrancaService.updateCobranca(id, valuesToSubmit)
        : await CobrancaService.createCobranca(valuesToSubmit);

      if (response.sucesso) {
        showMessage(id ? 'Cobrança atualizada com sucesso!' : 'Cobrança cadastrada com sucesso!', 1);
        return true;
      } else {
        showMessage(response.message || 'Erro inesperado ao processar a cobrança', 2);
        return false;
      }
    } catch (error) {
      showMessage('Erro ao salvar cobrança', 2);
      console.error('Erro ao salvar cobrança:', error);
      return false;
    }
  };

  const statusOptions = [
    { value: false, label: 'Pendente' },
    { value: true, label: 'Pago' },
  ];

  const clienteOptions = clientes.map(cliente => ({
    value: cliente.id,
    label: `${cliente.nome} - ${cliente.telefone}`,
  }));

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setClienteNome(value);
  };

  const handleSuggestionClick = (suggestion) => {
    const selectedCliente = clientes.find(cliente => cliente.id === suggestion.value);
    setCliente(selectedCliente);
    setClienteNome(selectedCliente ? selectedCliente.nome : '');
    setFormValues(prevValues => ({
      ...prevValues,
      clienteId: selectedCliente ? selectedCliente.id : '',
    }));
  };
  
  const handleChange = (event) => {
    const { name, value } = event.target;
  
    // Função para obter o novo valor baseado no campo
    const getNewValue = () => {
      switch (name) {
        case 'data':
          return new Date(value).toISOString().split('T')[0]; // Formata a data
        case 'valor':
          return formatarValor(value); // Formata o valor
        case 'pago':
          return value === 'true'; // Converte o valor para booleano
        default:
          return value; // Retorna o valor padrão para outros campos
      }
    };
  
    // Atualiza o estado com o novo valor
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: getNewValue(), // Chama a função para obter o novo valor
    }));
  };
  const formatToISO = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };


  const renderForm = () => (
    <div id="id_formulario_loading">
      <Input id="descricao" name="descricao" value={formValues.descricao} label="Descrição da Cobrança" onChange={handleChange} />
      <Input id="valor" name="valor" value={formValues.valor.toString()} label="Valor" onChange={handleChange} type="text" />
      <Input id="data" name="data" value={formatToISO(formValues.data)} label="Data de vencimento" onChange={handleChange} type="date" />
      <Select id="pago" name="pago" label="Status de Pagamento" options={statusOptions} value={formValues.pago} onChange={handleChange} />
      <InputSearch id="clienteId" name="ClienteId" label="Pesquise o Cliente (nome, telefone)" suggestions={clienteOptions} value={clienteNome} onChange={handleSearchChange} onSuggestionClick={handleSuggestionClick} />
    </div>
  );

  const renderLabels = () => (
    <div id="id_formulario_loading">
      <Label htmlFor="descricao" title="Descrição:" value={cobranca.descricao || ''} iconClass="file-earmark-text" />
      <Label htmlFor="valor" title="Valor:" value={cobranca.valor || 0} iconClass="currency-dollar" />
      <Label htmlFor="data" title="Data:" value={cobranca.data ? new Date(cobranca.data).toLocaleDateString() : ''} iconClass="calendar" />
      <Label htmlFor="pago" title="Status Pagamento:" value={cobranca.pago ? 'Sim' : 'Pendente'} iconClass="check-circle" />
      <Label htmlFor="clienteId" title="Cliente:" value={cliente ? `${cliente.nome} - ${cliente.telefone}` : 'Não selecionado'} iconClass="person" />
      <Label htmlFor="created" title="Data de Criação:" value={cobranca.insert || ''} iconClass="calendar" />
      <Label htmlFor="updated" title="Data de Atualização:" value={cobranca.update || ''} iconClass="calendar" />
    </div>
  );

  return isEditable ? { handleSubmit, renderForm } : { renderForm: renderLabels };
};

export default useCobrancaForm;
