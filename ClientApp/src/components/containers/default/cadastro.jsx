import React, { useState } from 'react';
import {  Form, FloatingLabel } from 'react-bootstrap';
import alerta from 'src/utils/alerta';
import request from 'src/utils/api';
import loading from 'src/utils/loading';
import { useNavigate } from 'react-router-dom';
import Formulario from '@objetos/Formulario';

const CadastroForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const register = async () => {
    const { nome, email, senha } = formData;
    try {
      loading(true, 'form');
      const response = await request('public/Cadastro/', 'POST', { nome, email, senha });
      if (response.sucesso === true) {
        alerta(response.message, 1);
        navigate('/login'); // Redireciona para a página de login após o cadastro bem-sucedido
      } else {
        alerta(response.message, 2);
      }
    } catch (error) {
      alerta('Erro ao registrar. Por favor, tente novamente.', 2);
    } finally {
      loading(false, 'form');
    }
  };

  const validate = () => formData.nome && formData.email && formData.senha;

  const handleSubmit = async () => {
    if (validate()) {
      await register();
    } else {
      alerta('Por favor, preencha todos os campos obrigatórios.', 2);
    }
  };

  const limpar = () => {
    setFormData({
      nome: '',
      email: '',
      senha: '',
    });
  };

  const renderContainer = () => (
    <>
      <FloatingLabel controlId="nome" className="mb-2" label="Nome">
        <Form.Control
          type="text"
          placeholder="Nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
        />
      </FloatingLabel>
      <FloatingLabel controlId="email" className="mb-2" label="E-mail">
        <Form.Control
          type="email"
          placeholder="E-mail"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </FloatingLabel>
      <FloatingLabel controlId="senha" className="mb-2" label="Senha">
        <Form.Control
          type="password"
          placeholder="Senha"
          name="senha"
          value={formData.senha}
          onChange={handleInputChange}
        />
      </FloatingLabel>
    </>
  );

  return (
    <form id="form" className="form-signin container mx-auto my-2">
      <Formulario
        headerIcon="person"
        headerTitle="Cadastro Usuário"
        formBody={renderContainer()}
        footerLeftButtonText="Limpar"
        footerLeftButtonAction={limpar}
        footerRightButtonText="Cadastrar"
        footerRightButtonAction={handleSubmit}
      />
    </form>
  );
};

export default CadastroForm;
