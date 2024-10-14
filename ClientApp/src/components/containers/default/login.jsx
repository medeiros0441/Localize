import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import request from 'src/utils/api';
import alerta from 'src/utils/alerta';
import loading from 'src/utils/loading';
import Formulario from '@objetos/Formulario';
import { useAuth } from 'src/utils/AuthProvider';
import { setCookie } from 'src/utils/storage';

const LoginForm = () => {
  const { setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const validateForm = () => email.trim() !== '' && senha.trim() !== '';

  const handleLogin = async () => {
    if (!validateForm()) {
      alerta('Preencha todos os campos!', 2,'form_login');
      return;
    }

      try {
        loading(true, 'form_login');
        const response = await request('public/login/', 'POST', { email, senha });
        
        if (response.sucesso) {
            // Armazena o token de autenticação no cookie
            setCookie('authToken', response.token, { expires: 1 }); // Define o cookie para expirar em 1 dia
            setCookie('authentication','true');
            setIsAuthenticated("true"); // Atualiza o estado no contexto
            navigate('/cliente'); // Redireciona para a página de usuários
        } else {
            alerta(response.message, 2, 'form_login');
        }
    } catch (error) {
        alerta(error.message || 'Erro ao fazer login', 2, 'form_login');
    } finally {
        loading(false, 'form_login');
    }
  };

  const handleRegister = () => {
    // Redireciona para a página de cadastro
    navigate('/cadastro');
  };

  return (
    <div id="form_login" className='container mx-auto'>

    <Formulario
      headerIcon="person"
      headerTitle="Acessar Conta"
      isDark={false}
      formBody={
        <>
          {/* Campo de e-mail */}
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

          {/* Campo de senha */}
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
        </>
      }
      footerLeftButtonText="Cadastre-se"
      footerLeftButtonAction={handleRegister}
      footerRightButtonText="Entrar"
      footerRightButtonAction={handleLogin}
    />
    </div>
  );
};

export default LoginForm;
