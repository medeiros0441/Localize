import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, setCookie } from './storage'; // Certifique-se de que esses métodos funcionam corretamente
import request from './api';

// Cria o contexto de autenticação
const AuthContext = createContext();

// Hook para acessar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Inicializa o estado de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(getCookie('authentication') === 'true');

  // Função para verificar a autenticação
  const checkAuthentication = async () => {
    try {
      const response = await request("public/CheckAuthentication/");
      
      // Avalia a resposta e atualiza o estado de autenticação
      if (response.authenticated) {
        setCookie('authentication', 'true');
        setIsAuthenticated(true);
      } else {
        setCookie('authentication', 'false');
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Em caso de erro, define como não autenticado
      console.error('Erro ao verificar autenticação:', error);
      setCookie('authentication', 'false');
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication(); // Verifica a autenticação uma vez ao montar
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuthentication, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
