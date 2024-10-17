# Etapa de construção para o back-end
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env

# Define o diretório de trabalho
WORKDIR /app

# Instala o Node.js e NPM
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copia e restaura as dependências do projeto .NET
COPY ProjectLocalize.csproj ./
RUN dotnet restore

# Copia todos os arquivos do projeto
COPY . ./

# Publica o projeto
RUN dotnet publish ProjectLocalize.csproj -c Release -o out

# Imagem final
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copia os arquivos publicados da etapa anterior
COPY --from=build-env /app/out .

# Configura a variável de ambiente e inicia a aplicação
ENV ASPNETCORE_URLS="http://*:$PORT"
CMD ["dotnet", "ProjectLocalize.dll"]
