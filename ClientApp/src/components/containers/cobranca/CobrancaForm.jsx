import React, { useState } from 'react';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import alerta from 'src/utils/alerta';
import request from 'src/utils/api';
import loading from 'src/utils/loading';
import { useNavigate } from 'react-router-dom';

function CobrancaForm({ cobrancaId, initialData, clienteId }) {
  const [formData, setFormData] = useState({
    Descricao: initialData?.Descricao || '',
    Valor: initialData?.Valor || 0.0,
    Data: initialData?.Data ? new Date(initialData.Data).toISOString().split('T')[0] : '', // Ajuste para o formato de data
    Pago: initialData?.Pago || false,
    ClienteId: clienteId || initialData?.ClienteId || "", // Presumindo que ClienteId seja fornecido externamente
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submit = async () => {
    try {
      loading(true, "ContainerFormulario");
      const endpoint = cobrancaId ? `public/cobrancas/${cobrancaId}/` : 'public/cobrancas/';
      const method = cobrancaId ? 'PUT' : 'POST';
      const response = await request(endpoint, method, formData);
      if (response.success) {
        alerta(response.message, 1);
        navigate('/cobrancas'); // Navega para a lista de cobranças ou para a página desejada
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
    return formData.Descricao && formData.Valor >= 0 && formData.Data && formData.ClienteId;
  };

  const handleSubmit = async () => {
    if (validate()) {
      await submit();
    } else {
      alerta('Por favor, preencha todos os campos obrigatórios e valide os dados.', 2);
    }
  };

  return (
    <div className="container my-5">
      <div className="card justify-content-center" id="ContainerFormulario">
        <div className="card-header">
          <h1 className="fw-bolder mt-2 mb-1 fs-6 font-monospace">
            <span className="bi bi-cash me-2"></span>{cobrancaId ? 'Editar Cobrança' : 'Nova Cobrança'}
          </h1>
        </div>
        <div className="card-body">
          <FloatingLabel controlId="Descricao" className="mb-2" label="Descrição">
            <Form.Control
              type="text"
              placeholder="Descrição"
              name="Descricao"
              value={formData.Descricao}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <FloatingLabel controlId="Valor" className="mb-2" label="Valor">
            <Form.Control
              type="number"
              step="0.01"
              placeholder="Valor"
              name="Valor"
              value={formData.Valor}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <FloatingLabel controlId="Data" className="mb-2" label="Data">
            <Form.Control
              type="date"
              placeholder="Data"
              name="Data"
              value={formData.Data}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <Form.Check 
            type="checkbox"
            id="Pago"
            label="Pago"
            name="Pago"
            checked={formData.Pago}
            onChange={handleInputChange}
          />
        </div>
        <div className="d-flex justify-content-end card-footer">
          <Button variant="primary" onClick={handleSubmit}>
            {cobrancaId ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CobrancaForm;
