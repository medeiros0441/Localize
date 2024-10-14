const path = require('path');
const { override } = require('customize-cra');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = override((config) => {
  // Configurar aliases
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    src: path.resolve(__dirname, 'src'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@css': path.resolve(__dirname, 'src/assets/css'),
    '@interface': path.resolve(__dirname, 'src/interface'),
    '@service': path.resolve(__dirname, 'src/service'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@containers': path.resolve(__dirname, 'src/components/containers'),
    '@usuario': path.resolve(__dirname, 'src/components/containers/usuario'),
    '@cliente': path.resolve(__dirname, 'src/components/containers/cliente'),
    '@cobranca': path.resolve(__dirname, 'src/components/containers/cobranca'),
    '@default': path.resolve(__dirname, 'src/components/containers/default'),
    '@objetos': path.resolve(__dirname, 'src/components/objetos'),
    '@utils': path.resolve(__dirname, 'src/utils'),
  };

  // Adicionar o plugin para garantir a sensibilidade a maiúsculas/minúsculas
  config.plugins.push(new CaseSensitivePathsPlugin());

  return config;
});
