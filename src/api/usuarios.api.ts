export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  status: string;
  dataCadastro: string;
}

const API_URL = 'http://localhost:3001/api/usuarios';

export const usuariosApi = {
  // Buscar todos os usuários
  getAll: async (): Promise<Usuario[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar usuários');
    return response.json();
  },

  // Buscar usuário por ID
  getById: async (id: number): Promise<Usuario | undefined> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error('Erro ao buscar usuário');
    }
    return response.json();
  },

  // Criar novo usuário
  create: async (usuario: Omit<Usuario, 'id' | 'dataCadastro'>): Promise<Usuario> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    });
    if (!response.ok) throw new Error('Erro ao criar usuário');
    return response.json();
  },

  // Atualizar usuário existente
  update: async (id: number, data: Partial<Omit<Usuario, 'id' | 'dataCadastro'>>): Promise<Usuario | undefined> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error('Erro ao atualizar usuário');
    }
    return response.json();
  },

  // Deletar usuário
  delete: async (id: number): Promise<boolean> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      if (response.status === 404) return false;
      throw new Error('Erro ao deletar usuário');
    }
    return true;
  },
};
