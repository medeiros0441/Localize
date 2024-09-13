import React from 'react';
import { createRoot } from 'react-dom/client'; 
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'src/assets/css/Global.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <App />
);
