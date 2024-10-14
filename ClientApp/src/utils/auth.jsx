import { getCookie, setCookie } from './storage';
import request from './api';
import { useState, useEffect } from 'react';

export const useAuthentication = () => {
  const [cookieValue, setCookieValue] = useState(getCookie('authentication') || null); // Define o estado inicial com o valor do cookie

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await request("public/CheckAuthentication/");

        if (response.success) {
          const isAuthenticated = response.authenticated;
          setCookie('authentication', isAuthenticated); // Define o cookie com base na resposta
          setCookieValue(isAuthenticated); // Atualiza o estado com base na resposta
        } else {
          console.error('Autenticação falhou:', response.message);
          setCookie('authentication', false); // Define o cookie como false em caso de falha
          setCookieValue(false); // Atualiza o estado como false
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setCookie('authentication', false); // Define o cookie como false em caso de erro
        setCookieValue(false); // Atualiza o estado como false
      }
    };

    // Executa a verificação apenas se o valor do cookie for null
    if (cookieValue === null) {
      checkAuthentication();
    }
  }, [cookieValue]); // O hook só será executado se cookieValue mudar

  return cookieValue; // Retorna o valor atual do cookie
};
