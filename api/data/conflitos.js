// Dados mockados de conflitos para solicitações
export const conflitosPorSolicitacao = {
  1: {
    medico: 'Dr. Carlos Souza',
    crm: '12345-SP',
    especialidade: 'Cardiologia',
    similaridade: 92,
    conflitos: [
      {
        tipo: 'nome',
        campo: 'Nome Completo',
        valor1: 'Dr. Carlos Alberto Souza',
        valor2: 'Dr. Carlos A. Souza',
        registro1: { fonte: 'Hospital São Lucas', ultimaAtualizacao: '2025-10-15' },
        registro2: { fonte: 'Clínica Vida', ultimaAtualizacao: '2025-10-28' }
      },
      {
        tipo: 'emails',
        campo: 'E-mail Profissional',
        valor1: 'carlos.souza@hospital.com.br',
        valor2: 'dr.carlos@clinica.com.br',
        registro1: { fonte: 'Hospital São Lucas', ultimaAtualizacao: '2025-07-15' },
        registro2: { fonte: 'Clínica Vida', ultimaAtualizacao: '2025-10-22' }
      },
      {
        tipo: 'telefones',
        campo: 'Telefone Celular',
        valor1: '(11) 98765-4321',
        valor2: '(11) 91234-5678',
        registro1: { fonte: 'Hospital São Lucas', ultimaAtualizacao: '2025-08-10' },
        registro2: { fonte: 'Clínica Vida', ultimaAtualizacao: '2025-10-20' }
      }
    ]
  },
  2: {
    medico: 'Dra. Ana Paula Lima',
    crm: '67890-RJ',
    especialidade: 'Pediatria',
    similaridade: 95,
    conflitos: [
      {
        tipo: 'emails',
        campo: 'E-mail Profissional',
        valor1: 'ana.lima@hospital.com.br',
        valor2: 'dra.anapaula@clinica.com.br',
        registro1: { fonte: 'Hospital Santa Cruz', ultimaAtualizacao: '2025-09-15' },
        registro2: { fonte: 'Clínica Infantil', ultimaAtualizacao: '2025-10-20' }
      },
      {
        tipo: 'telefones',
        campo: 'Telefone Comercial',
        valor1: '(21) 99999-8888',
        valor2: '(21) 3333-4444',
        registro1: { fonte: 'Hospital Santa Cruz', ultimaAtualizacao: '2025-08-10' },
        registro2: { fonte: 'Clínica Infantil', ultimaAtualizacao: '2025-10-15' }
      }
    ]
  },
  4: {
    medico: 'Dra. Mariana Costa',
    crm: '23456-SP',
    especialidade: 'Dermatologia',
    similaridade: 96,
    conflitos: [
      {
        tipo: 'telefones',
        campo: 'Telefone Celular',
        valor1: '(11) 97777-8888',
        valor2: '(11) 96666-5555',
        registro1: { fonte: 'Clínica Derma Plus', ultimaAtualizacao: '2025-10-01' },
        registro2: { fonte: 'Hospital Estética', ultimaAtualizacao: '2025-10-20' }
      },
      {
        tipo: 'enderecos',
        campo: 'Endereço do Consultório',
        valor1: 'Av. Paulista, 1000 - São Paulo/SP',
        valor2: 'Rua Augusta, 500 - São Paulo/SP',
        registro1: { fonte: 'Clínica Derma Plus', ultimaAtualizacao: '2025-09-15' },
        registro2: { fonte: 'Hospital Estética', ultimaAtualizacao: '2025-10-18' }
      }
    ]
  }
};
