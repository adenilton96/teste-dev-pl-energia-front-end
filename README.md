# Teste Dev PL Lumi - Front-End

Este projeto é uma aplicação web que exibe demonstrativos em gráficos e cards, além de oferecer uma biblioteca de faturas, permitindo que os usuários baixem suas faturas de energia elétrica. A aplicação é desenvolvida em React e utiliza a biblioteca Chart.js para renderização de gráficos. 
ela ituliza de uma api que esta disponivel no git https://github.com/adenilton96/Teste-Dev-PL-Lumi

## Estrutura do Projeto

A estrutura do projeto é a seguinte:

    ├───node_modules
    ├───public
    ├───components
    │   ├───AreaChart
    │   ├───BarChart
    │   ├───Cards
    │   ├───Dashboard
    │   ├───EnergyBalance
    │   ├───Header
    │   ├───Invoice
    │   ├───InvoiceGrid
    │   └───Sidebar
    ├───img
    ├───rotas
    └───servicos

## Tecnologias Utilizadas

- **React**: biblioteca JavaScript para construção de interfaces de usuário.
- **Chart.js**: biblioteca para gráficos.
- **Axios**: biblioteca para fazer requisições HTTP.

## Dependências
As dependências do projeto estão listadas no `package.json`:

    ```json
    {
    "dependencies": {
        "@testing-library/jest-dom": "^5.17.0",
        "@testing-library/react": "^13.4.0",
        "@testing-library/user-event": "^13.5.0",
        "axios": "^1.7.7",
        "chart.js": "^4.4.5",
        "react": "^18.3.1",
        "react-chartjs-2": "^5.2.0",
        "react-dom": "^18.3.1",
        "react-router-dom": "^6.27.0",
        "react-scripts": "5.0.1",
        "web-vitals": "^2.1.4"
    }
    }

## Scripts

Os seguintes scripts estão disponíveis para facilitar o desenvolvimento:

- **npm start*: Inicia a aplicação em modo de desenvolvimento.

## Instalação

Para instalar as dependências do projeto, execute o seguinte comando:

    ```bash
    npm install
    
1. Clone o repositório
   
   ```bash
    git clone https://github.com/adenilton96/teste-dev-pl-energia-front-end.git

2. Navegue até o diretório do projeto:
    
    ```bash
    cd teste-dev-pl-energia-front-end

3. Instale as dependências:

    ```bash
    npm install

4.Inicie a aplicação:

    ```bash 
    npm start

## Observação 

Pra utiliza este projetio e nessesario fazer o instalação e subir a API na porta **8000**

O codigo da API esta no git **https://github.com/adenilton96/teste-dev-pl-energia-back-end-api** 

