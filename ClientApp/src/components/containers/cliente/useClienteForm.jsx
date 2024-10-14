import React, { useState, useEffect, useCallback } from 'react';
import Input from '@objetos/Input';
import Label from '@objetos/Label';
import ClienteService from '@service/ClienteService';
import alerta from '@utils/alerta';

const useClienteForm = (id, isEditable) => {
    const [formValues, setFormValues] = useState({
        id: '',
        nome: '',
        telefone: '',
        documento: '',     // documento deve estar na interface (se necessário)
        endereco: '',      // Endereço deve estar na interface (se necessário)
    });
    const [cliente, setCliente] = useState({});

    // Refatoração da função de mostrar mensagens
    const showMessage = (message, type) => alerta(message, type); // type: 1 para sucesso, 2 para erro

    const fetchCliente = useCallback(async () => {
        if (!id) {
            showMessage('ID do cliente não fornecido', 2);
            return;
        }

        try {
            const response = await ClienteService.getClienteById(id);
            if (response.sucesso) {
                setFormValues(response.cliente);
                setCliente(response.cliente);
            } else {
                showMessage(response.message, 2);
            }
        } catch {
            showMessage('Erro ao buscar cliente', 2);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchCliente();
        }
    }, [id, fetchCliente]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const validatePayload = ({ nome, telefone, documento }) => {
        const errors = [];
    
        // Validação do nome
        if (!nome.trim()) {
            errors.push('nome do cliente é obrigatório.');
        } else if (nome.length < 3) {
            errors.push('O nome deve ter pelo menos 3 caracteres.');
        }
    
        // Validação do telefone
        if (!telefone.trim()) {
            errors.push('telefone é obrigatório.');
        } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(telefone)) { // Validação do formato do telefone
            errors.push('O telefone deve estar no formato (xx) xxxxx-xxxx.');
        }
    
        // Validação do documento (CPF)
        if (!documento.trim()) {
            errors.push('documento é obrigatório.');
        } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(documento)) { // Validação do formato do CPF
            errors.push('O documento deve estar no formato xxx.xxx.xxx-xx.');
        }
    
        return errors;
    };
    

    const handleSubmit = async () => {
        const errors = validatePayload(formValues);
        if (errors.length > 0) {
            showMessage(`Erro:\n${errors.join('\n')}`, 2);
            return;
        }
        // Verifica se 'id' é nulo e, se for, remove a propriedade 'id' de formValues
        const valuesToSubmit = id ? formValues : (({ id, ...rest }) => rest)(formValues); 
        try {
            const response = id
                ? await ClienteService.updateCliente(id, formValues)
                : await ClienteService.createCliente(valuesToSubmit); // Adiciona a lógica para criar um novo cliente

            if (response.sucesso) {
                showMessage(id ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!', 1);
                return true;
            } else {
                showMessage(response.message, 2);
                return false;
            }
        } catch {
            showMessage('Erro ao salvar cliente', 2);
            return false;
        }
    };

    const renderForm = () => (
        <div>
            <Input
                id="nome"
                name="nome"
                value={formValues.nome}
                label="nome do Cliente"
                onChange={handleChange}
            />
           <Input
            id="telefone"
            name="telefone"
            value={formValues.telefone}
            label="telefone"
            onChange={handleChange}
            type="tel"
            mask="(99) 99999-9999" // Máscara para telefone
        />
       
        <Input
            id="documento"
            name="documento"
            value={formValues.documento}
            label="documento (CPF)"
            onChange={handleChange}
            mask="999.999.999-99" // Máscara para CPF
        />
        <Input
            id="endereco"
            name="endereco"
            value={formValues.endereco}
            label="Endereço"
            onChange={handleChange}
        /> 
            
        </div>
    );
    const renderLabels = () => (
        <div>
            <Label htmlFor="nome" title="nome do Cliente:" value={cliente.nome || ''} iconClass="person" />
            <Label htmlFor="telefone" title="telefone:" value={cliente.telefone || ''} iconClass="telephone" />
            <Label htmlFor="documento" title="documento:" value={cliente.documento || ''} iconClass="file-earmark-text" />
            <Label htmlFor="endereco" title="Endereço:" value={cliente.endereco || ''} iconClass="house" />
            <Label htmlFor="created" title="Data de Criação:" value={cliente.insert || ''} iconClass="calendar" /> {/* Propriedade Created */}
            <Label htmlFor="updated" title="Data de Atualização:" value={cliente.update || ''} iconClass="calendar" /> {/* Propriedade Updated */}
        </div>
    );
    

    return isEditable ? { handleSubmit, renderForm } : { renderForm: renderLabels };
};

export default useClienteForm;
