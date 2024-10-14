import React from 'react';

const Footer = () => {
  return (
    <footer className="footer" style={{ background: '#0D1B2A' }}>
      <div className="font-montserrat  redound-3 px-3 text-center d-flex-inline">
        <p className="m-0 p-0 text-white rounded " style={{ fontSize: '0.8rem' }}>
          Software Desenvolvido por <a className="text-white" href="https://br.linkedin.com/in/samuelmedeirosbc" target="blank">@Samuel Medeiros</a>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
