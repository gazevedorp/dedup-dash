# API Mock - Sistema de Gestão

API REST completa com dados mockados em memória para gerenciar Usuários, Solicitações e Parâmetros.

## Instalação

```bash
cd api
npm install
```

## Executar

```bash
npm start
```

Ou com auto-reload (Node 18+):

```bash
npm run dev
```

A API estará disponível em `http://localhost:3001`

## Estrutura do Projeto

```
api/
├── data/              # Dados mockados
│   ├── usuarios.js
│   ├── solicitacoes.js
│   └── parametros.js
├── routes/            # Rotas modulares
│   ├── usuarios.js
│   ├── solicitacoes.js
│   └── parametros.js
├── server.js          # Servidor principal
├── package.json
└── README.md
```

## Endpoints

### 👥 Usuários

#### GET /api/usuarios
Retorna todos os usuários.

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao.silva@empresa.com",
    "cargo": "Desenvolvedor",
    "departamento": "TI",
    "status": "ativo",
    "dataCadastro": "2024-01-15"
  }
]
```

#### GET /api/usuarios/:id
Retorna um usuário específico.

#### POST /api/usuarios
Cria um novo usuário.

**Body:**
```json
{
  "nome": "Maria Silva",
  "email": "maria@empresa.com",
  "cargo": "Analista",
  "departamento": "RH",
  "status": "ativo"
}
```

#### PUT /api/usuarios/:id
Atualiza um usuário existente.

#### DELETE /api/usuarios/:id
Remove um usuário.

---

### 📝 Solicitações

#### GET /api/solicitacoes
Retorna todas as solicitações.

**Query Params (Filtros):**
- `status` - Filtrar por status (ex: `?status=Em andamento`)
- `prioridade` - Filtrar por prioridade (ex: `?prioridade=Alta`)
- `solicitante` - Filtrar por nome do solicitante (ex: `?solicitante=Maria`)

**Exemplo:**
```
GET /api/solicitacoes?status=Em%20andamento&prioridade=Alta
```

**Resposta:**
```json
[
  {
    "id": 1,
    "titulo": "Implementar novo módulo de relatórios",
    "descricao": "Criar funcionalidade para geração de relatórios personalizados",
    "solicitante": "Maria Santos",
    "prioridade": "Alta",
    "status": "Em andamento",
    "dataAbertura": "2024-11-01",
    "dataPrevisao": "2024-11-15"
  }
]
```

#### GET /api/solicitacoes/:id
Retorna uma solicitação específica.

#### POST /api/solicitacoes
Cria uma nova solicitação.

**Body:**
```json
{
  "titulo": "Nova funcionalidade",
  "descricao": "Descrição detalhada da solicitação",
  "solicitante": "João Silva",
  "prioridade": "Média",
  "status": "Aguardando",
  "dataPrevisao": "2024-12-01"
}
```

#### PUT /api/solicitacoes/:id
Atualiza uma solicitação existente.

#### DELETE /api/solicitacoes/:id
Remove uma solicitação.

---

### ⚙️ Parâmetros

#### GET /api/parametros
Retorna todos os parâmetros.

**Resposta:**
```json
[
  {
    "id": 1,
    "chave": "parametro_1",
    "peso": "1",
    "descricao": "Parâmetro 1"
  }
]
```

#### GET /api/parametros/:id
Retorna um parâmetro específico.

#### POST /api/parametros
Cria um novo parâmetro.

**Body:**
```json
{
  "chave": "novo_parametro",
  "peso": "5",
  "descricao": "Descrição do novo parâmetro"
}
```

#### PUT /api/parametros/:id
Atualiza um parâmetro existente.

#### DELETE /api/parametros/:id
Remove um parâmetro.

---

## Características

- ✅ API REST completa com CRUD
- ✅ Estrutura modular e organizada
- ✅ Dados mockados em memória
- ✅ CORS habilitado
- ✅ Filtros em solicitações (query params)
- ✅ Validação de campos obrigatórios
- ✅ Tratamento de erros 404 e 400
- ✅ Respostas padronizadas

## Observações

- Os dados são armazenados em memória e serão resetados ao reiniciar o servidor
- CORS está habilitado para todas as origens
- A API roda na porta **3001**
- Para produção, considere usar um banco de dados real

## Exemplos de Uso

### Usando fetch (JavaScript)

```javascript
// Buscar todas as solicitações com status "Em andamento"
const response = await fetch('http://localhost:3001/api/solicitacoes?status=Em%20andamento');
const solicitacoes = await response.json();

// Criar novo usuário
const response = await fetch('http://localhost:3001/api/usuarios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Pedro Silva',
    email: 'pedro@empresa.com',
    cargo: 'Desenvolvedor',
    departamento: 'TI'
  })
});
const novoUsuario = await response.json();
```
