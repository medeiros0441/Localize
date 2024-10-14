import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@utils/AuthProvider';
import { getCookie, setCookie } from 'src/utils/storage';

// Componente de ícone reutilizável
const Icon = ({ name, text }) => (
  <>
    <i className={`bi bi-${name}`}></i>
    {text && <span className="ms-1">{text}</span>}
  </>
);

// Componentes para o menu padrão
const ItensDefault = () => (
  <>
    <MenuItem to="/login" icon="box-arrow-in-right" text="Login" />
    <MenuItem to="/cadastro" icon="pencil-square" text="Cadastro" />
  </>
);

// Componente de item do menu
const MenuItem = ({ to, icon, text }) => (
  <li className="text-center d-inline-flex col-auto">
    <Link className="nav-link text-decoration-none text-white nav-link-icon px-0 align-items-center" to={to}>
      <Icon name={icon} text={text} />
    </Link>
  </li>
);

// Componentes para o menu quando o usuário está autenticado
const ItensAssinante = ({ onLogout }) => (
  <>
    <MenuItem to="/cliente" icon="people" text="Clientes" />
    <MenuItem to="/cobranca" icon="cash-stack" text="Cobranças" />
    <li className="d-inline-flex col-auto">
      <Link className="nav-link text-decoration-none text-white bg-transparent border-0" onClick={onLogout}>
        <Icon name="box-arrow-right" text="Sair" />
      </Link>
    </li>
  </>
);

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const menuState = getCookie('menuState');
    const menu = document.getElementById('navbarNav');
    const icon = document.getElementById('menuIcon');

    if (menuState === 'visible') {
      menu.classList.remove('d-none');
      icon.classList.replace('bi-box-arrow-down', 'bi-box-arrow-in-up');
    } else {
      menu.classList.add('d-none');
      icon.classList.replace('bi-box-arrow-in-up', 'bi-box-arrow-down');
    }
  }, []);

  const toggleMenu = () => {
    const menu = document.getElementById('navbarNav');
    const icon = document.getElementById('menuIcon');

    const isHidden = menu.classList.contains('d-none');
    menu.classList.toggle('d-none', !isHidden);
    icon.classList.toggle('bi-box-arrow-down', isHidden);
    icon.classList.toggle('bi-box-arrow-in-up', !isHidden);
    setCookie('menuState', isHidden ? 'visible' : 'hidden');
  };

  const handleLogout = () => {
    setCookie('authToken', "");
    setCookie('authentication', "false");
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="navbar-expand-md navbar-dark pt-3 pb-2 font-montserrat" style={{ background: '#0D1B2A' }}>
      <div className="p-0 m-0 mx-auto container-xl row">
        <div className="p-0 m-0 col-12 container justify-content-between row align-items-center">
          <Link className="col text-sm-center text-start text-decoration-none" to="/">
            <p className="mb-2 text-white" style={{ fontSize: '20px' }}>
              Localize Project
            </p>
          </Link>
          <button className="btn text-white col-auto d-inline-flex ms-auto d-sm-none" type="button" onClick={toggleMenu}>
            <span className="bi bi-box-arrow-in-up" id="menuIcon" style={{ fontSize: '20px' }}></span>
          </button>
        </div>
        <div className="col-12 d-sm-block d-none" id="navbarNav">
          <ul className="text-decoration-none text-center text-white my-2 row mx-auto mx-sm-0 col-auto container-xl font-monospace text-center text-sm-end justify-content-center align-items-center">
            {isAuthenticated ? <ItensAssinante onLogout={handleLogout} /> : <ItensDefault />}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
