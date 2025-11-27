# My Gastronomy – Sistema de Pedidos para Restaurante

Este repositório reúne o frontend e o backend de uma aplicação web de pedidos para o restaurante fictício **My Gastronomy**, focado em culinária italiana.  
A ideia é oferecer uma experiência simples e agradável para o cliente fazer pedidos online, enquanto o time do restaurante gerencia pratos, usuários e pedidos em um painel administrativo.

## Objetivo do Projeto

Criar uma solução fullstack que simula o fluxo completo de um restaurante:

- O cliente navega pelo cardápio, visualiza detalhes dos pratos e monta seu pedido.
- O pedido é confirmado com dados de contato/entrega.
- O restaurante acompanha e administra pedidos, cardápio e usuários em uma área administrativa.

Além de atender ao caso de uso de restaurante, o projeto serve como prática de desenvolvimento web, separando responsabilidades entre frontend, backend, banco de dados e testes automatizados.

## Funcionalidades Principais

- **Página inicial** apresentando o restaurante e sua proposta gastronômica.
- **Listagem de pratos** com categorias (entradas, principais, sobremesas).
- **Detalhes de cada prato** (descrição, ingredientes, disponibilidade).
- **Carrinho de compras** para adicionar, remover e atualizar itens.
- **Fluxo de confirmação de pedido** com popup de confirmação.
- **Autenticação de usuários** (login/cadastro) com controle de acesso.
- **Área administrativa** para:
  - Gerenciar pratos (criar, editar, remover, ativar/desativar).
  - Visualizar e acompanhar pedidos realizados.
  - Gerenciar usuários.

## Tecnologias Utilizadas

- **Frontend**
  - React + Vite
  - React Router
  - Context API para carrinho
  - CSS Modules e Material UI (MUI) para estilização
- **Backend**
  - Node.js + Express
  - MongoDB
  - Autenticação com Passport (local) e JWT
---
