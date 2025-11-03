export interface Parametro {
  id: number;
  chave: string;
  peso: string;
  descricao: string;
}

const API_URL = 'http://localhost:3001/api/parametros';

export const parametrosApi = {
  // Buscar todos os parâmetros
  getAll: async (): Promise<Parametro[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar parâmetros');
    return response.json();
  },

  // Buscar parâmetro por ID
  getById: async (id: number): Promise<Parametro | undefined> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error('Erro ao buscar parâmetro');
    }
    return response.json();
  },

  // Criar novo parâmetro
  create: async (parametro: Omit<Parametro, 'id'>): Promise<Parametro> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parametro),
    });
    if (!response.ok) throw new Error('Erro ao criar parâmetro');
    return response.json();
  },

  // Atualizar parâmetro existente
  update: async (id: number, data: Partial<Omit<Parametro, 'id'>>): Promise<Parametro | undefined> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error('Erro ao atualizar parâmetro');
    }
    return response.json();
  },

  // Deletar parâmetro
  delete: async (id: number): Promise<boolean> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      if (response.status === 404) return false;
      throw new Error('Erro ao deletar parâmetro');
    }
    return true;
  },
};
