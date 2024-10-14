-- Active: 1723815847137@@127.0.0.1@3306
-- apesar do create, o gerenciamento do db está sendo feito atraves do EF (Entity Framework)

s
CREATE TABLE Usuario (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Nome VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Senha VARCHAR(128) NOT NULL
);
CREATE TABLE Cliente (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Nome VARCHAR(255) NOT NULL,
    Documento CHAR(14) NOT NULL,
    Telefone CHAR(15) NOT NULL,
    Endereco VARCHAR(255) NOT NULL,
    UsuarioId UUID NOT NULL,
    CONSTRAINT fk_Usuario
        FOREIGN KEY (UsuarioId) 
        REFERENCES Usuario (Id)
        ON DELETE CASCADE
);
CREATE TABLE Cobranca (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Descricao VARCHAR(500) NOT NULL,
    Valor DECIMAL(10, 2) NOT NULL,
    DataVencimento DATE NOT NULL,
    Pago BOOLEAN NOT NULL DEFAULT FALSE,
    ClienteId UUID NOT NULL,
    CONSTRAINT fk_Cliente
        FOREIGN KEY (ClienteId) 
        REFERENCES Cliente (Id)
        ON DELETE CASCADE
);
