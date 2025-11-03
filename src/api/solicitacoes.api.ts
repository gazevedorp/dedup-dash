export interface Solicitacao {
  id: number;
  titulo: string;
  descricao: string;
  solicitante: string;
  prioridade: string;
  status: string;
  dataAbertura: string;
  dataPrevisao: string | null;
}

const API_URL = 'http://localhost:3001/api/solicitacoes';

export const solicitacoesApi = {
  // Buscar todas as solicitações
  getAll: async (filters?: { status?: string; prioridade?: string; solicitante?: string }): Promise<Solicitacao[]> => {
    let url = API_URL;

    if (filters) {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.prioridade) params.append('prioridade', filters.prioridade);
      if (filters.solicitante) params.append('solicitante', filters.solicitante);

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar solicitações');
    return response.json();
  },

  // Buscar solicitação por ID
  getById: async (id: number): Promise<Solicitacao | undefined> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error('Erro ao buscar solicitação');
    }
    return response.json();
  },

  // Criar nova solicitação
  create: async (solicitacao: Omit<Solicitacao, 'id' | 'dataAbertura'>): Promise<Solicitacao> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(solicitacao),
    });
    if (!response.ok) throw new Error('Erro ao criar solicitação');
    return response.json();
  },

  // Atualizar solicitação existente
  update: async (id: number, data: Partial<Omit<Solicitacao, 'id' | 'dataAbertura'>>): Promise<Solicitacao | undefined> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error('Erro ao atualizar solicitação');
    }
    return response.json();
  },

  // Deletar solicitação
  delete: async (id: number): Promise<boolean> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      if (response.status === 404) return false;
      throw new Error('Erro ao deletar solicitação');
    }
    return true;
  },

  // Buscar conflitos de uma solicitação
  getConflitos: async (id: number): Promise<any> => {
    const response = await fetch(`${API_URL}/${id}/conflitos`);
    if (!response.ok) {
      if (response.status === 404) return { conflitos: [] };
      throw new Error('Erro ao buscar conflitos');
    }
    return response.json();
  },
};
