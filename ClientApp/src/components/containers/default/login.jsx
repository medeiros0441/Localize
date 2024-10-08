import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import request from 'src/utils/api';
import alerta from 'src/utils/alerta';
import loading from 'src/utils/loading';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();  // Use useNavigate hook

  const validateForm = () => email.trim() !== '' && senha.trim() !== '';

  const handleLogin = async () => {
    if (!validateForm()) {
      alerta('Preencha todos os campos!', 2);
      return;
    }
    try {
      loading(true, 'form_login');

      const response = await request('usuarios/login/', "POST", { email, senha });
      if (response.sucess) {
        navigate('/usuarios');  // Redireciona o usuário
      } else {
        alerta(response.message, 2, "form_login");
      }
    } catch (error) {
      alerta(error, 2, 'form_login');
    } finally {
      loading(false, 'form_login');
    }
  };

  return (
    <>

      <form id="form_login" className="form-signin container mx-auto">
        <div className="px-sm-2 p-4 my-3 modal modal-signin position-static d-block align-items-center">
          <div className="modal-dialog m-0 m-sm-auto">
            <div className="modal-content mb-2 bg-body rounded-3 border">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <i width="32" height="32" className="bi mb-1 bi-person"></i>
                  <h1 className="text-center mb-1 ms-2 fw-normal small text-dark mx-auto">Acessar Conta</h1>
                </div>
              </div>
              <div className="modal-body">
                <div className="form-floating mb-2">
                  <input
                    type="email"
                    className="form-control"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="email">E-mail</label>
                </div>

                <div className="form-floating mb-2">
                  <input
                    type="password"
                    className="form-control"
                    autoComplete="off"
                    id="senha"
                    name="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                  <label htmlFor="senha">Senha</label>
                </div>
 
                <div className="col-12 mb-4">
                  <a tabIndex="8" className="ms-auto link-secondary small mx-auto rounded-2" href="/cadastro">
                    Cadastre-se
                  </a>
                  <button
                    id="submit-btn"
                    className="btn btn-primary float-end me-2 btn-md"
                    type="button"
                    onClick={handleLogin}
                  >
                    Entrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
