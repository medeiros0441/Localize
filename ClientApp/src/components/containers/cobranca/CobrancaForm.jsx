import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Formulario from '@objetos/Formulario';
import useCobrancaForm from './useCobrancaForm';

function CobrancaForm() {
    const { id } = useParams(); // Obtém o ID da URL
    const { id_cliente } = useParams(); // Obtém o ID da URL
    const navigate = useNavigate();
    
    // Usa o hook useCobrancaForm, passando o ID e a editabilidade
    const { handleSubmit, renderForm } = useCobrancaForm(id || false, true,id_cliente);
    
    const handleFormSubmit = async () => {
        const success = await handleSubmit();
        if (success) {
            navigate('/cobranca'); // Substitua pela rota desejada
        }
    };

    return (
        <Formulario
            headerIcon="file-earmark-text" // Ícone para cobrança
            headerTitle={id ? 'Editar Cobrança' : 'Cadastrar Cobrança'} // Muda o título conforme a operação
            isDark={false}
            formBody={renderForm()} // Renderiza o formulário baseado no hook
            footerLeftButtonText={id ? 'Cancelar' : 'Voltar'}
            footerLeftButtonAction={() => navigate('/cobranca')} // Navega para a lista de cobranças
            footerRightButtonText={id ? 'Salvar' : 'Cadastrar'}
            footerRightButtonAction={handleFormSubmit} // Chama a função de submit do formulário
        />
    );
}

export default CobrancaForm;
