# YTFetch - API de Download de Vídeos do YouTube

YTFetch é uma API desenvolvida em Nest.js que permite fazer o download de vídeos do YouTube usando filas implementadas com Bull e Redis. Esta documentação fornecerá informações sobre como configurar, executar e usar a API.

## Pré-requisitos

Certifique-se de que você tenha as seguintes dependências instaladas antes de prosseguir:

Node.js
Redis Server

## Funcionalidades

- Download de Vídeos: Faça o download de vídeos do YouTube facilmente usando a API do YTFetch.
- Fila de Tarefas: Utilize filas para gerenciar e processar os pedidos de download de forma eficiente.
- Redis para Armazenamento: Armazene dados da fila e informações de estado no Redis para melhor desempenho e confiabilidade.

## Instalação

Clone o repositório do YTFetch.

```bash
  git clone https://github.com/seuusuario/ytfetch.git
  cd ytfetch
```

Instale as dependências do projeto.

```bash
    pnpm i
```

Inicie o servidor

```bash
    pnpm run start:dev
```

A API estará disponível em http://localhost:3000 por padrão

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`QUEUE_HOST=127.0.0.1`
`QUEUE_PORT=6379`
`QUEUE_USERNAME=user`
`QUEUE_PASSWORD=123`

## Documentação

[Documentação](http://localhost:3000/docs)
