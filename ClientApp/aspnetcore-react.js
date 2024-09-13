// Este script configura o arquivo .env.development.local com variáveis de ambiente adicionais
// para configurar o HTTPS usando o certificado de desenvolvimento do ASP.NET Core no proxy de desenvolvimento do webpack.

const fs = require('fs');
const path = require('path');

// Define a pasta base onde os certificados estão localizados, dependendo do sistema operacional (Windows ou Unix-based)
const baseFolder =
  process.env.APPDATA !== undefined && process.env.APPDATA !== ''
    ? `${process.env.APPDATA}/ASP.NET/https`
    : `${process.env.HOME}/.aspnet/https`;

// Obtém o nome do certificado a partir de um argumento de linha de comando (--name=<<app>>) ou da variável de ambiente npm_package_name
const certificateArg = process.argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg.groups.value : process.env.npm_package_name;

// Verifica se o nome do certificado foi fornecido; se não, exibe um erro e encerra o script
if (!certificateName) {
  console.error('Nome do certificado inválido. Execute este script no contexto de um script npm/yarn ou passe --name=<<app>> explicitamente.')
  process.exit(-1);
}

// Define os caminhos para os arquivos de certificado (.pem) e chave (.key) com base no nome do certificado
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

// Se o arquivo .env.development.local não existir, cria o arquivo e adiciona as variáveis de ambiente SSL_CRT_FILE e SSL_KEY_FILE
if (!fs.existsSync('.env.development.local')) {
  fs.writeFileSync(
    '.env.development.local',
`SSL_CRT_FILE=${certFilePath}
SSL_KEY_FILE=${keyFilePath}`
  );
} else {
  // Se o arquivo já existir, verifica se as variáveis SSL_CRT_FILE e SSL_KEY_FILE estão presentes
  let lines = fs.readFileSync('.env.development.local')
    .toString()
    .split('\n'); 

  let hasCert, hasCertKey = false;
  for (const line of lines) {
    if (/SSL_CRT_FILE=.*/i.test(line)) {
      hasCert = true;
    }
    if (/SSL_KEY_FILE=.*/i.test(line)) {
      hasCertKey = true;
    }
  }
  // Se as variáveis não estiverem presentes, adiciona-as ao final do arquivo
  if (!hasCert) {
    fs.appendFileSync(
      '.env.development.local',
      `\nSSL_CRT_FILE=${certFilePath}`
    );
  }
  if (!hasCertKey) {
    fs.appendFileSync(
      '.env.development.local',
      `\nSSL_KEY_FILE=${keyFilePath}`
    );
  }
}
