import express from 'express';
import cors from 'cors';
import usuariosRouter from './routes/usuarios.js';
import solicitacoesRouter from './routes/solicitacoes.js';
import parametrosRouter from './routes/parametros.js';

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de boas-vindas
app.get('/', (req, res) => {
  res.json({
    message: 'API Mock - Sistema de Gestão',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      solicitacoes: '/api/solicitacoes',
      parametros: '/api/parametros',
    },
  });
});

// Rotas modulares
app.use('/api/usuarios', usuariosRouter);
app.use('/api/solicitacoes', solicitacoesRouter);
app.use('/api/parametros', parametrosRouter);

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware para erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 API rodando em http://localhost:${PORT}`);
  console.log(`\n📋 Endpoints disponíveis:\n`);

  console.log(`👥 Usuários:`);
  console.log(`   GET    http://localhost:${PORT}/api/usuarios`);
  console.log(`   GET    http://localhost:${PORT}/api/usuarios/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/usuarios`);
  console.log(`   PUT    http://localhost:${PORT}/api/usuarios/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/usuarios/:id\n`);

  console.log(`📝 Solicitações:`);
  console.log(`   GET    http://localhost:${PORT}/api/solicitacoes`);
  console.log(`   GET    http://localhost:${PORT}/api/solicitacoes/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/solicitacoes`);
  console.log(`   PUT    http://localhost:${PORT}/api/solicitacoes/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/solicitacoes/:id\n`);

  console.log(`⚙️  Parâmetros:`);
  console.log(`   GET    http://localhost:${PORT}/api/parametros`);
  console.log(`   GET    http://localhost:${PORT}/api/parametros/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/parametros`);
  console.log(`   PUT    http://localhost:${PORT}/api/parametros/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/parametros/:id\n`);
});
