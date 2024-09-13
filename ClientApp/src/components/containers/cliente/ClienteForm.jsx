import React, { useState } from 'react';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import alerta from 'src/utils/alerta';
import request from 'src/utils/api';
import loading from 'src/utils/loading';
import { useNavigate } from 'react-router-dom';

function ClienteForm({ clienteId, initialData }) {
  const [formData, setFormData] = useState({
    Nome: initialData?.Nome || '',
    Documento: initialData?.Documento || '',
    Telefone: initialData?.Telefone || '',
    Endereco: initialData?.Endereco || '',
    UsuarioId: initialData?.UsuarioId || '', // Presumindo que UsuarioId seja fornecido internamente
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const submit = async () => {
    try {
      loading(true, "ContainerFormulario");
      const endpoint = clienteId ? `public/clientes/${clienteId}/` : 'public/clientes/';
      const method = clienteId ? 'PUT' : 'POST';
      const response = await request(endpoint, method, formData);
      if (response.success) {
        alerta(response.message, 1);
        navigate('/clientes'); // Navega para a lista de clientes ou para a página desejada
      } else {
        alerta(response.message, 2);
      }
    } catch (error) {
      alerta('Erro ao salvar os dados. Por favor, tente novamente.', 2);
    } finally {
      loading(false, "ContainerFormulario");
    }
  };

  const validate = () => {
    // Implemente a validação dos dados do formulário aqui
    return formData.Nome && formData.Documento && formData.Telefone && formData.Endereco;
  };

  const handleSubmit = async () => {
    if (validate()) {
      await submit();
    } else {
      alerta('Por favor, preencha todos os campos obrigatórios.', 2);
    }
  };

  return (
    <div className="container my-5">
      <div className="card justify-content-center" id="ContainerFormulario">
        <div className="card-header">
          <h1 className="fw-bolder mt-2 mb-1 fs-6 font-monospace">
            <span className="bi bi-person me-2"></span>{clienteId ? 'Editar Cliente' : 'Novo Cliente'}
          </h1>
        </div>
        <div className="card-body">
          <FloatingLabel controlId="Nome" className="mb-2" label="Nome">
            <Form.Control
              type="text"
              placeholder="Nome"
              name="Nome"
              value={formData.Nome}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <FloatingLabel controlId="Documento" className="mb-2" label="Documento">
            <Form.Control
              type="text"
              placeholder="Documento"
              name="Documento"
              value={formData.Documento}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <FloatingLabel controlId="Telefone" className="mb-2" label="Telefone">
            <Form.Control
              type="text"
              placeholder="Telefone"
              name="Telefone"
              value={formData.Telefone}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <FloatingLabel controlId="Endereco" className="mb-2" label="Endereço">
            <Form.Control
              type="text"
              placeholder="Endereço"
              name="Endereco"
              value={formData.Endereco}
              onChange={handleInputChange}
            />
          </FloatingLabel>
        </div>
        <div className="d-flex justify-content-end card-footer">
          <Button variant="primary" onClick={handleSubmit}>
            {clienteId ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ClienteForm;
