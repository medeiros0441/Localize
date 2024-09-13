import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthentication } from './utils/auth';

// Componentes
import Login from 'src/components/containers/default/login';
import Cadastro from 'src/components/containers/default/cadastro';
import Erro from 'src/components/erro';
import ClienteForm from 'src/components/containers/cliente/ClienteForm';
import ClienteLista from 'src/components/containers/cliente/ClienteLista';
import CobrancaForm from 'src/components/containers/cobranca/CobrancaForm';
import CobrancaLista from 'src/components/containers/cobranca/CobrancaLista';

const Router = () => {
  const isAuthenticated = useAuthentication();

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route
        path="/erro-interno"
        element={<Erro title="Erro Interno" descricao="Ocorreu um erro interno no servidor. Tente novamente mais tarde." />}
      />
      <Route
        path="*"
        element={<Erro title="Página Não Encontrada" descricao="A página que você está procurando não existe." />}
      />

      {/* Rotas privadas */}
      <Route
        path="/cliente/"
        element={isAuthenticated  === true ? <ClienteForm /> : <Navigate to="/login" />}
      />
      <Route
        path="/cliente/form"
        element={isAuthenticated === true ? <ClienteLista /> : <Navigate to="/login" />}
      />
      <Route
        path="/cobranca"
        element={isAuthenticated  === true ? <CobrancaForm /> : <Navigate to="/login" />}
      />
      <Route
        path="/cobranca/form"
        element={isAuthenticated  === true ? <CobrancaLista /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default Router;
