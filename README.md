# Senac Watson Assistant

![Made By Certsys](https://img.shields.io/badge/made%20by-CERTSYS-green.svg)

> Workspaces Orchestration API dentro do Watson Assistant para apresentação inicial de chatbot

Este projeto é para a orquestração dos Workspaces dentro do Watson Assistant, porque a arquitetura dos espaços de trabalho dentro do Assistente está dividida em vários nós de conhecimento separados dentro da Senac. Por este motivo, é necessário orquestrar a comunicação entre estes espaços de trabalho e a parte frontal da solução. Porque se o bot estiver numa plataforma, é necessário que seja transparente que o utilizador está a viajar através de vários nós de conhecimento, e isto para o desenvolvimento e melhorias do bot, se for uma boa prática.

## Instalação / Iniciar

Uma breve introdução sobre a configuração mínima necessária para rodar o projeto.

```shell
npm install / npm i
npm start / npm run start:dev
```

## Desenvolvimento

### Desenvolvido com

-   Node.js
-   Express.js
-   HJS

### Configuração do Dev

Aqui está uma breve introdução sobre o que um desenvolvedor deve fazer para começar a desenvolver o projeto:

```shell
git clone https://github.com/certsys/senac-assistants-api.git
cd senac-assistants-api/
npm install / npm i
npm start / npm run start:dev
```

### Deploy

Para que o repositório siga organizado e com boas práticas aplicadas, pedimos para que siga o padrão (se possível) quando for adicionar uma feature ou resolver algum bug.

##### < tipos > utilizados:

<b>feat</b>: quando for uma nova solução
<b>fix</b>: quando for uma resolução de um problema/bug.
<b>docs</b>: quando houver mudanças relacionadas a documentação (README.md).

##### Padrão de commits:

Não faça commit's direto na branch <b>master</b>, siga o seguinte padrão.

```shell
# Crie uma branch
git checkout -b <tipo>/<miniDescricao>

# Desenvolva as alterações necessárias

# Suba o seu desenvolvimento
git add .
git commit -m "<tipo>:  <descricao do desenvolvimento>"
git push --set-upstream origin <tipo>/<miniDescricao>

# Passa para o ambiente de Homolog
git checkout homolog
git merge <tipo>/<miniDescricao>
git push

# Assim que for autorizado subir para Prod, faça
git checkout master
git merge homolog
git push

# Exclua a branch de sua alteração (para não poluir o repositório)
# excluir remotamente
git push origin --delete <tipo>/<miniDescricao>

# excluir localmente
git branch -d <tipo>/<miniDescricao>
```

### API Endpoints

Temos os seguintes endpoints para a api:

-   **[GET]** /mobile - index do Chatbot de Suporte (mandar as informações por URL)
-   **[GET]** / - index do Chatbot na web (mandar o payload na chamada do widget)
