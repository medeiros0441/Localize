import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@utils/AuthProvider'; 

// Componentes
import Login from '@default/login';
import Cadastro from '@default/cadastro';
import Erro from '@components/erro';

import ClienteForm from '@cliente/ClienteForm';
import ClienteLista from '@cliente/ClienteLista';
import ClienteView from '@cliente/ClienteView';

import CobrancaForm from '@cobranca/CobrancaForm';
import CobrancaView from '@cobranca/CobrancaView';
import CobrancaLista from '@cobranca/CobrancaLista';

// Novos componentes para usuário
import UsuarioForm from '@usuario/UsuarioForm';
import UsuarioLista from '@usuario/UsuarioLista';
import UsuarioView from '@usuario/UsuarioView';

const Router = () => {
  const { isAuthenticated } = useAuth(); // Obtém o estado de autenticação

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

      {/* Rotas privadas para Cliente */}
      <Route path="/cliente/" element={isAuthenticated ? <ClienteLista /> : <Navigate to="/login" />} />
      <Route path="/cliente/create/" element={isAuthenticated ? <ClienteForm /> : <Navigate to="/login" />} />
      <Route path="/cliente/edit/:id" element={isAuthenticated ? <ClienteForm /> : <Navigate to="/login" />} />
      <Route path="/cliente/view/:id" element={isAuthenticated ? <ClienteView /> : <Navigate to="/login" />} />

      {/* Rotas privadas para Cobrança */}
      <Route path="/cobranca/" element={isAuthenticated ? <CobrancaLista /> : <Navigate to="/login" />} />
      <Route path="/cobranca/edit/:id" element={isAuthenticated ? <CobrancaForm /> : <Navigate to="/login" />} />
      <Route path="/cobranca/create/:id_cliente?" element={isAuthenticated ? <CobrancaForm /> : <Navigate to="/login" />} />
      <Route path="/cobranca/view/:id" element={isAuthenticated ? <CobrancaView /> : <Navigate to="/login" />} />

      {/* Rotas privadas para Usuário */}
      <Route path="/usuario/" element={isAuthenticated ? <UsuarioLista /> : <Navigate to="/login" />} />
      <Route path="/usuario/create/" element={isAuthenticated ? <UsuarioForm /> : <Navigate to="/login" />} />
      <Route path="/usuario/edit/:id" element={isAuthenticated ? <UsuarioForm /> : <Navigate to="/login" />} />
      <Route path="/usuario/view/:id" element={isAuthenticated ? <UsuarioView /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default Router;
