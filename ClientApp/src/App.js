import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Base from './components/Base';
import RouterConfig from './router';
import { AuthProvider } from './utils/AuthProvider'; // Importar o AuthProvider

const App = () => (
  <AuthProvider>
    <Router>
      <Base>
        <RouterConfig />
      </Base>
    </Router>
  </AuthProvider>
);

export default App;
