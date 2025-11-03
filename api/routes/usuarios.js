import express from 'express';
import { usuarios } from '../data/usuarios.js';

const router = express.Router();

// GET - Buscar todos os usuários
router.get('/', (req, res) => {
  res.json(usuarios);
});

// GET - Buscar usuário por ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  res.json(usuario);
});

// POST - Criar novo usuário
router.post('/', (req, res) => {
  const { nome, email, cargo, departamento, status } = req.body;

  if (!nome || !email || !cargo || !departamento) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, email, cargo, departamento' });
  }

  const novoId = Math.max(...usuarios.map(u => u.id), 0) + 1;
  const novoUsuario = {
    id: novoId,
    nome,
    email,
    cargo,
    departamento,
    status: status || 'ativo',
    dataCadastro: new Date().toISOString().split('T')[0],
  };

  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

// PUT - Atualizar usuário
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, cargo, departamento, status } = req.body;

  const index = usuarios.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  usuarios[index] = {
    ...usuarios[index],
    nome: nome || usuarios[index].nome,
    email: email || usuarios[index].email,
    cargo: cargo || usuarios[index].cargo,
    departamento: departamento || usuarios[index].departamento,
    status: status || usuarios[index].status,
  };

  res.json(usuarios[index]);
});

// DELETE - Deletar usuário
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = usuarios.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  usuarios.splice(index, 1);
  res.status(204).send();
});

export default router;
