import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthentication } from '../utils/auth';
import Cookies from 'js-cookie';

// Componente para os itens padrão
const ItensDefault = () => (
  <>
    
    <li className="text-center d-inline-flex col-auto">
      <Link className="nav-link text-decoration-none text-white nav-link-icon   px-0 align-items-center" to="/login">
          <i className="bi bi-person"></i>
        <span className="text-decoration-none">Login</span>
      </Link>
    </li>
     <li className="  text-center d-inline-flex col-auto">
      <Link className="nav-link text-decoration-none text-white nav-link-icon   px-0 align-items-center" to="/cadastro">
        <i className="bi bi-toglle"></i> Cadastro
      </Link>
    </li>
  </>
);

const ItensAssinante = () => (
  <>
      <li className="d-inline-flex col-auto">
        <Link className="nav-link" to="/clientes-list">
          <i className="bi bi-speedometer2"></i> Clientes
        </Link>
      </li>
      <li className="d-inline-flex col-auto">
        <Link className="nav-link nav-link-icon" to="/cobrancas-list">
          <i className="bi bi-people"></i> Cobranças
        </Link>
      </li>
  </>
);

const Navbar = () => {
  const isCliente = useAuthentication();

  useEffect(() => {
    const menuState = Cookies.get('menuState');
    const menu = document.getElementById('navbarNav');
    const icon = document.getElementById('menuIcon');
    if (menuState === 'visible') {
      menu.classList.remove('d-none');
      icon.classList.remove('bi-box-arrow-down');
      icon.classList.add('bi-box-arrow-in-up');
    } else {
      menu.classList.add('d-none');
      icon.classList.remove('bi-box-arrow-in-up');
      icon.classList.add('bi-box-arrow-down');
    }
  }, []);

  const toggleMenu = () => {
    const menu = document.getElementById('navbarNav');
    const icon = document.getElementById('menuIcon');
    if (menu.classList.contains('d-none')) {
      menu.classList.remove('d-none');
      icon.classList.remove('bi-box-arrow-down');
      icon.classList.add('bi-box-arrow-in-up');
      Cookies.set('menuState', 'visible');
    } else {
      menu.classList.add('d-none');
      icon.classList.remove('bi-box-arrow-in-up');
      icon.classList.add('bi-box-arrow-down');
      Cookies.set('menuState', 'hidden');
    }
  };

  return (
    <nav className="navbar-expand-md navbar-dark pt-3 pb-2 font-montserrat" style={{ background: '#0D1B2A' }}>
      <div className="p-0 m-0 mx-auto container-xl row">
        <div className="p-0 m-0 col-12 container justify-content-between row align-items-center">
          <Link className="col text-sm-center text-start text-decoration-none" to="/">
            <p className="  mb-2 text-white" style={{ fontSize: '20px' }}>
              Localize Project
            </p>
          </Link>
          <button className="btn text-white col-auto d-inline-flex ms-auto d-sm-none" type="button" onClick={toggleMenu}>
            <span className="bi bi-box-arrow-in-up" id="menuIcon" style={{ fontSize: '20px' }}></span>
          </button>
        </div>
        <div className="col-12 d-sm-block d-none" id="navbarNav">
          <ul className="text-decoration-none text-center text-white my-2 row mx-auto mx-sm-0 col-auto container-xl font-monospace text-center text-sm-end justify-content-center align-items-center">
            {isCliente === true ? <ItensAssinante  /> : <ItensDefault />}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
