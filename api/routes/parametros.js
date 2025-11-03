import express from 'express';
import { parametros } from '../data/parametros.js';

const router = express.Router();

// GET - Buscar todos os parâmetros
router.get('/', (req, res) => {
  res.json(parametros);
});

// GET - Buscar parâmetro por ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const parametro = parametros.find(p => p.id === id);

  if (!parametro) {
    return res.status(404).json({ error: 'Parâmetro não encontrado' });
  }

  res.json(parametro);
});

// POST - Criar novo parâmetro
router.post('/', (req, res) => {
  const { chave, peso, descricao } = req.body;

  if (!chave || !peso || !descricao) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const novoId = Math.max(...parametros.map(p => p.id), 0) + 1;
  const novoParametro = { id: novoId, chave, peso, descricao };

  parametros.push(novoParametro);
  res.status(201).json(novoParametro);
});

// PUT - Atualizar parâmetro
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { chave, peso, descricao } = req.body;

  const index = parametros.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Parâmetro não encontrado' });
  }

  parametros[index] = {
    ...parametros[index],
    chave: chave || parametros[index].chave,
    peso: peso || parametros[index].peso,
    descricao: descricao || parametros[index].descricao,
  };

  res.json(parametros[index]);
});

// DELETE - Deletar parâmetro
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = parametros.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Parâmetro não encontrado' });
  }

  parametros.splice(index, 1);
  res.status(204).send();
});

export default router;
