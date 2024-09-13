import React from 'react';

const Footer = ({ isCliente }) => {
  return (
    <footer className="footer" style={{ background: '#0D1B2A' }}>
      <div className="col-10 font-montserrat col-flex-inline redound p-0 text-center mb-auto full-width mx-auto">
        <p className="m-0 p-0 bg-white rounded text-black" style={{ fontSize: '0.8rem' }}>
          Software Desenvolvido por <a className="text-decoration-none text-black" href="https://br.linkedin.com/in/samuelmedeirosbc" target="blank">@Samuel Medeiros</a>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
