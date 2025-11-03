import express from 'express';
import { solicitacoes } from '../data/solicitacoes.js';
import { conflitosPorSolicitacao } from '../data/conflitos.js';

const router = express.Router();

// GET - Buscar todas as solicitações
router.get('/', (req, res) => {
  // Suporte para filtros via query params
  const { status, prioridade, solicitante } = req.query;

  let resultado = [...solicitacoes];

  if (status) {
    resultado = resultado.filter(s => s.status.toLowerCase() === status.toLowerCase());
  }

  if (prioridade) {
    resultado = resultado.filter(s => s.prioridade.toLowerCase() === prioridade.toLowerCase());
  }

  if (solicitante) {
    resultado = resultado.filter(s => s.solicitante.toLowerCase().includes(solicitante.toLowerCase()));
  }

  res.json(resultado);
});

// GET - Buscar solicitação por ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const solicitacao = solicitacoes.find(s => s.id === id);

  if (!solicitacao) {
    return res.status(404).json({ error: 'Solicitação não encontrada' });
  }

  res.json(solicitacao);
});

// POST - Criar nova solicitação
router.post('/', (req, res) => {
  const { titulo, descricao, solicitante, prioridade, status, dataPrevisao } = req.body;

  if (!titulo || !descricao || !solicitante || !prioridade) {
    return res.status(400).json({
      error: 'Campos obrigatórios: titulo, descricao, solicitante, prioridade'
    });
  }

  const novoId = Math.max(...solicitacoes.map(s => s.id), 0) + 1;
  const novaSolicitacao = {
    id: novoId,
    titulo,
    descricao,
    solicitante,
    prioridade,
    status: status || 'Aguardando',
    dataAbertura: new Date().toISOString().split('T')[0],
    dataPrevisao: dataPrevisao || null,
  };

  solicitacoes.push(novaSolicitacao);
  res.status(201).json(novaSolicitacao);
});

// PUT - Atualizar solicitação
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, descricao, solicitante, prioridade, status, dataPrevisao } = req.body;

  const index = solicitacoes.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Solicitação não encontrada' });
  }

  solicitacoes[index] = {
    ...solicitacoes[index],
    titulo: titulo || solicitacoes[index].titulo,
    descricao: descricao || solicitacoes[index].descricao,
    solicitante: solicitante || solicitacoes[index].solicitante,
    prioridade: prioridade || solicitacoes[index].prioridade,
    status: status || solicitacoes[index].status,
    dataPrevisao: dataPrevisao || solicitacoes[index].dataPrevisao,
  };

  res.json(solicitacoes[index]);
});

// DELETE - Deletar solicitação
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = solicitacoes.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Solicitação não encontrada' });
  }

  solicitacoes.splice(index, 1);
  res.status(204).send();
});

// GET - Buscar conflitos de uma solicitação
router.get('/:id/conflitos', (req, res) => {
  const id = parseInt(req.params.id);

  // Verificar se a solicitação existe
  const solicitacao = solicitacoes.find(s => s.id === id);
  if (!solicitacao) {
    return res.status(404).json({ error: 'Solicitação não encontrada' });
  }

  // Retornar conflitos se existirem
  const conflitosData = conflitosPorSolicitacao[id];
  if (conflitosData) {
    res.json(conflitosData);
  } else {
    res.json({ conflitos: [] });
  }
});

export default router;
