# Blog Tech Mobile

Aplicativo mobile do **Blog Tech**, desenvolvido em **React Native com Expo** para o Tech Challenge da Fase 4 da Pós Tech FIAP (Full Stack Development). Ele consome a mesma API REST do projeto web e segue a mesma identidade visual e as mesmas regras de acesso.

| Projeto | Repositório |
| :--- | :--- |
| Back-end (Node.js, Fastify, PostgreSQL) | https://github.com/Tallyon-Lima/Blog-Tech-Challenge |
| Front-end web (React) | https://github.com/danilolugli/Blog-Tech-Front |
| App mobile (este repositório) | https://github.com/Tallyon-Lima/Blog-Tech-Challenge-App |

## Funcionalidades

| Tela | Perfis com acesso | O que faz |
| :--- | :--- | :--- |
| Login | Todos | Autentica com e-mail e senha e guarda a sessão no aparelho. |
| Home (lista de posts) | Aluno, Professor, Admin | Lista os posts (título, autor, disciplina, data e resumo) com busca por palavra-chave e rolagem infinita. |
| Detalhe do post | Aluno, Professor, Admin | Mostra o conteúdo completo (com títulos, listas, negrito e itálico) e os comentários; permite comentar, editar e excluir comentários. Professor (dono) e Admin editam/excluem o post. |
| Gerenciar Posts | Professor, Admin | Lista, busca, cria, edita e exclui posts. |
| Gerenciar Usuários | Admin | Lista paginada com busca e filtro por perfil; cria, edita e exclui professores e alunos. |

Regras de autorização (iguais às do web):

- **Aluno** (perfil 1): apenas visualiza posts e adicionar comentários.
- **Professor** (perfil 2): cria posts e edita/exclui **os próprios** posts, além, de editar comentários dos alunos.
- **Admin** (perfil 3): gerencia todos os posts e todos os usuários.
- Telas restritas não aparecem no menu e, se abertas por link direto, o usuário é devolvido à Home.
- A sessão expira junto com o token (30 minutos): o app faz logout automático e avisa o usuário.

## Tecnologias

- [Expo](https://expo.dev) SDK 58, React Native 0.88 e React 19 (componentes funcionais e hooks)
- [Expo Router](https://docs.expo.dev/router/introduction) (rotas baseadas em arquivos, rotas protegidas e menu lateral)
- TypeScript
- `@react-native-async-storage/async-storage` para guardar a sessão
- Context API para o estado de autenticação

## Como executar

### Pré-requisitos

- Node.js 20 ou superior
- App **Expo Go** no celular (ou um emulador Android/iOS)
- O back-end rodando (veja abaixo)

### 1. Instalar e configurar

```bash
npm install
cp .env.example .env
```

Edite o `.env` e informe a URL da API:

```env
EXPO_PUBLIC_API_URL=http://<IP-DO-SEU-PC>:3000
```

| Onde o app roda | URL da API |
| :--- | :--- |
| Celular com Expo Go (mesma rede Wi-Fi do PC) | `http://<IP-do-PC-na-rede>:3000` |
| Emulador Android | `http://10.0.2.2:3000` |
| Simulador iOS / navegador | `http://localhost:3000` |

No Windows, libere a porta 3000 no firewall para o celular conseguir acessar a API. Depois de alterar o `.env`, reinicie o `npx expo start`.

### 2. Subir o back-end local

No repositório do back-end:

```bash
docker compose up -d postgres
npm install
npm run start:dev
```

A API sobe em `http://localhost:3000`. Mais detalhes no README do back-end.

### 3. Iniciar o app

```bash
npx expo start
```

Escaneie o QR Code com o Expo Go (Android) ou com a câmera (iOS).

### Scripts

| Comando | Descrição |
| :--- | :--- |
| `npm start` | Inicia o servidor de desenvolvimento do Expo |
| `npm run android` / `npm run ios` | Inicia e abre no emulador |
| `npx tsc --noEmit` | Verificação de tipos |
| `npx expo lint` | Lint |

## Arquitetura

```
src/
├── app/                  # Somente rotas (Expo Router)
│   ├── _layout.tsx       # Raiz: AuthProvider, splash e rotas protegidas (login x área logada)
│   ├── login.tsx         # Rota /login
│   └── (app)/            # Área logada, com menu lateral (Drawer)
│       ├── _layout.tsx   # Drawer e guardas por perfil
│       ├── index.tsx     # Home (lista de posts)
│       ├── post/[id].tsx # Detalhe do post
│       ├── manager-posts.tsx
│       └── manager-users.tsx
├── screens/              # Telas: <Tela>.tsx + controller + estilos
├── components/           # Componentes reutilizáveis (AppHeader, MenuLateral, BottomSheet, modais)
├── contexts/             # AuthContext: sessão, perfil, logout e expiração do token
├── services/             # Chamadas HTTP por domínio (auth, posts, users)
├── api/                  # Cliente HTTP central (token no header, tratamento de erro e 401)
├── types/                # Tipos da API e das telas
├── constants/            # Cores (identidade do web), perfis, disciplinas
└── utils/                # Utilitários (toast/alertas)
```

Camadas e responsabilidades (mesmo padrão do front web):

- **Tela (`index.tsx`)**: apenas interface e estado de tela.
- **Controller (`index.controller.ts`)**: validação, regras de negócio e conversão entre o formato da API e o da tela.
- **Service**: única camada que conhece os endpoints.
- **`api/api.ts`**: `fetch` com `Authorization: Bearer <token>`. Se a API responde 401 com token enviado, a sessão é encerrada.

### Autenticação e autorização

1. O login chama `POST /usuarios/signin` e recebe `{ token, user }`.
2. O `AuthContext` guarda token, usuário e perfil no AsyncStorage (a senha/hash que o back-end devolve **nunca** é guardada) e agenda o logout para o horário de expiração do JWT.
3. Ao abrir o app, a sessão salva é restaurada enquanto a splash fica visível.
4. O layout raiz usa `Stack.Protected`: `/login` só existe sem sessão e `(app)` só existe com sessão. Dentro de `(app)`, o `Drawer.Protected` restringe Posts (perfis 2 e 3) e Usuários (perfil 3).

### Endpoints utilizados

| Método | Endpoint | Uso |
| :--- | :--- | :--- |
| POST | `/usuarios/signin` | Login |
| GET | `/posts?paginaAtual&itensPagina` | Lista de posts |
| GET | `/posts/search?pesquisa&paginaAtual&itensPagina` | Busca de posts |
| GET | `/posts/:id` | Dados do post (edição) |
| POST / PUT / DELETE | `/posts`, `/posts/:id` | Criar, editar e excluir post |
| GET | `/posts/:id/comentarios` | Comentários do post |
| POST / PUT / DELETE | `/comentarios`, `/comentarios/:id` | Criar, editar e excluir comentário |
| GET | `/usuarios/:id` | Nome e perfil do autor do post |
| GET / POST | `/usuarios` | Listar e criar usuários |
| PUT / DELETE | `/usuarios/editar/:id`, `/usuarios/:id` | Editar e excluir usuário |

## Guia de uso

1. **Entrar**: informe e-mail e senha e toque em *Entrar*.
2. **Menu**: toque no botão de menu (canto superior esquerdo). Os itens variam conforme o perfil. O rodapé mostra o usuário logado e o botão *Sair*.
3. **Home e detalhe**: busque por palavra-chave e toque em um post para ler. No detalhe, escreva comentários (até 255 caracteres); o lápis e a lixeira aparecem nos comentários e no post que você pode modificar. *Voltar* retorna à tela de onde você veio.
4. **Gerenciar Posts**: *Novo* abre o formulário (título, disciplina, conteúdo; o autor é o usuário logado). Em cada post, o lápis edita (os dados atuais são carregados) e a lixeira exclui após confirmação. Puxe a lista para baixo para atualizar.
5. **Gerenciar Usuários** (Admin): busca por nome/e-mail, filtro por perfil e *Novo*/editar/excluir.

## Desafios e decisões

- **Rotas separadas do código de tela**: o Expo Router transforma qualquer arquivo de `src/app` em rota, então telas e componentes ficam fora dessa pasta.
- **Mesmas regras do web**: permissões por perfil implementadas no menu, nas rotas e nos botões de cada post.
- **Edição preserva o autor**: o `PUT /posts/:id` regrava o autor; por isso o app reenvia o autor original em vez do usuário que está editando.
- **Comentários e o back-end**: o `PUT /comentarios/:id` exige `usuario_solicitante`, `post_id` e `autor_id` no corpo, então o app envia o corpo completo.
- **Listas sempre atualizadas**: como as telas do menu permanecem montadas, um contador de versão (`utils/postsVersao.ts`) avisa as listas quando um post muda em outra tela.
- **Sessão com expiração**: o back-end emite tokens de 30 minutos sem refresh, então o app encerra a sessão automaticamente.
