import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Formulario from '@objetos/Formulario';
import useClienteForm from './useClienteForm';

function ClienteForm() {
  const { id } = useParams(); // Obtém o ID da URL
  const navigate = useNavigate();
  
  // Usa o hook useClienteForm, passando o ID e a editabilidade
  const { handleSubmit, renderForm } = useClienteForm(id || false, true);
  
   
  const handleFormSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
    navigate('/cliente'); // Substitua pela rota desejada
    }
  };

  return (
    <Formulario
      headerIcon="person"
      headerTitle={id ? 'Editar Cliente' : 'Cadastrar Cliente'} // Muda o título conforme a operação
      isDark={false}
      formBody={renderForm()} // Renderiza o formulário baseado no hook
      footerLeftButtonText={id ? 'Cancelar' : 'Voltar'}
      footerLeftButtonAction={() => navigate('/cliente')} // Navega para a lista de clientes
      footerRightButtonText={id ? 'Salvar' : 'Cadastrar'}
      footerRightButtonAction={handleFormSubmit} // Chama a função de submit do formulário
    />
  );
}

export default ClienteForm;
