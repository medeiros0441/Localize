import React, { useState } from 'react';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import alerta from 'src/utils/alerta';
import request from 'src/utils/api';
import loading from 'src/utils/loading';
import { useNavigate } from 'react-router-dom';

function CadastroForm() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const register = async () => {
    const { nome, email, senha } = formData;
    try {
      loading(true, "ContainerFormulario");
      const response = await request("usuario/register/", "POST", { nome, email, senha });
      if (response.success) {
        alerta(response.message, 1);
        navigate('/login');
      } else {
        alerta(response.message, 2);
      }
    } catch (error) {
      alerta('Erro ao registrar. Por favor, tente novamente.', 2);
    } finally {
      loading(false, "ContainerFormulario");
    }
  };

  const validate = () => {
    return formData.nome && formData.email && formData.senha;
  };

  const handleSubmit = async () => {
    if (validate()) {
      await register();
    } else {
      alerta('Por favor, preencha todos os campos obrigatórios.', 2);
    }
  };

  return (
    <div className="container my-5">
      <div className="card justify-content-center" id="ContainerFormulario">
        <div className="card-header">
          <h1 className="fw-bolder mt-2 mb-1 fs-6 font-monospace">
            <span className="bi bi-user me-2"></span>Cadastro Usuário
          </h1>
        </div>
        <div className="card-body">
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
        </div>
        <div className="d-flex justify-content-end card-footer">
          <Button variant="primary" onClick={handleSubmit}>Cadastrar</Button>
        </div>
      </div>
    </div>
  );
}

export default CadastroForm;
