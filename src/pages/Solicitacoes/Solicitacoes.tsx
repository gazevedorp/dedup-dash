import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Check } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type TipoConflito = 'nome' | 'enderecos' | 'telefones' | 'emails';
type StatusSolicitacao = 'pendente' | 'resolvido';
type OpcaoResolucao = 'manter_primeiro' | 'manter_segundo' | 'manter_ambos' | 'descartar_ambos' | 'inserir_valor';

interface RegistroMedico {
  fonte: string;
  ultimaAtualizacao: string;
}

interface Conflito {
  tipo: TipoConflito;
  campo: string;
  valor1: string;
  valor2: string;
  registro1: RegistroMedico;
  registro2: RegistroMedico;
  resolucao?: OpcaoResolucao;
  valorPersonalizado?: string;
}

interface DuplicacaoMedico {
  id: number;
  medico: string;
  crm: string;
  especialidade: string;
  dataDeteccao: string;
  status: StatusSolicitacao;
  conflitos: Conflito[];
  decisao?: string;
  similaridade?: number; // Percentual de similaridade que detectou a duplicação
}

const Solicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState<DuplicacaoMedico[]>([
    {
      id: 1,
      medico: 'Dr. Carlos Souza',
      crm: '12345-SP',
      especialidade: 'Cardiologia',
      dataDeteccao: '2025-10-30',
      status: 'pendente',
      similaridade: 92,
      conflitos: [
        {
          tipo: 'nome',
          campo: 'Nome Completo',
          valor1: 'Dr. Carlos Alberto Souza',
          valor2: 'Dr. Carlos A. Souza',
          registro1: {
            fonte: 'Hospital São Lucas',
            ultimaAtualizacao: '2025-10-15',
          },
          registro2: {
            fonte: 'Clínica Vida',
            ultimaAtualizacao: '2025-10-28',
          }
        },
        {
          tipo: 'enderecos',
          campo: 'Endereço do Consultório',
          valor1: 'Rua das Flores, 123 - Sala 405 - Centro - São Paulo/SP - CEP 01000-000',
          valor2: 'Av. Paulista, 1000 - Conj. 801 - Bela Vista - São Paulo/SP - CEP 01310-100',
          registro1: {
            fonte: 'Hospital São Lucas',
            ultimaAtualizacao: '2025-09-20',
          },
          registro2: {
            fonte: 'Clínica Vida',
            ultimaAtualizacao: '2025-10-25',
          }
        },
        {
          tipo: 'telefones',
          campo: 'Telefone Celular',
          valor1: '(11) 98765-4321',
          valor2: '(11) 91234-5678',
          registro1: {
            fonte: 'Hospital São Lucas',
            ultimaAtualizacao: '2025-08-10',
          },
          registro2: {
            fonte: 'Clínica Vida',
            ultimaAtualizacao: '2025-10-20',
          }
        },
        {
          tipo: 'emails',
          campo: 'E-mail Profissional',
          valor1: 'carlos.souza@hospital.com.br',
          valor2: 'dr.carlos@clinica.com.br',
          registro1: {
            fonte: 'Hospital São Lucas',
            ultimaAtualizacao: '2025-07-15',
          },
          registro2: {
            fonte: 'Clínica Vida',
            ultimaAtualizacao: '2025-10-22',
          }
        },
      ],
    },
    {
      id: 2,
      medico: 'Dra. Ana Paula Lima',
      crm: '67890-RJ',
      especialidade: 'Pediatria',
      dataDeteccao: '2025-10-29',
      status: 'resolvido',
      similaridade: 95,
      conflitos: [
        {
          tipo: 'emails',
          campo: 'E-mail Profissional',
          valor1: 'ana.lima@hospital.com.br',
          valor2: 'dra.anapaula@clinica.com.br',
          resolucao: 'manter_ambos',
          registro1: {
            fonte: 'Hospital Santa Cruz',
            ultimaAtualizacao: '2025-09-15',
          },
          registro2: {
            fonte: 'Clínica Infantil',
            ultimaAtualizacao: '2025-10-20',
          }
        },
        {
          tipo: 'telefones',
          campo: 'Telefone Comercial',
          valor1: '(21) 99999-8888',
          valor2: '(21) 3333-4444',
          resolucao: 'manter_ambos',
          registro1: {
            fonte: 'Hospital Santa Cruz',
            ultimaAtualizacao: '2025-08-10',
          },
          registro2: {
            fonte: 'Clínica Infantil',
            ultimaAtualizacao: '2025-10-15',
          }
        },
      ],
      decisao: 'E-mail Profissional: mantidos ambos, Telefone Comercial: mantidos ambos',
    },
    {
      id: 3,
      medico: 'Dr. Roberto Lima',
      crm: '11111-RJ',
      especialidade: 'Ortopedia',
      dataDeteccao: '2025-10-28',
      status: 'pendente',
      similaridade: 88,
      conflitos: [
        {
          tipo: 'nome',
          campo: 'Nome Completo',
          valor1: 'Dr. Roberto de Lima Santos',
          valor2: 'Dr. Roberto Lima',
          registro1: {
            fonte: 'Hospital Ortopédico RJ',
            ultimaAtualizacao: '2025-09-10',
          },
          registro2: {
            fonte: 'Clínica Ortoped',
            ultimaAtualizacao: '2025-10-15',
          }
        },
        {
          tipo: 'emails',
          campo: 'E-mail de Contato',
          valor1: 'roberto.lima@hospital.com.br',
          valor2: 'dr.roberto@clinica.com.br',
          registro1: {
            fonte: 'Hospital Ortopédico RJ',
            ultimaAtualizacao: '2025-07-05',
          },
          registro2: {
            fonte: 'Clínica Ortoped',
            ultimaAtualizacao: '2025-10-10',
          }
        },
        {
          tipo: 'enderecos',
          campo: 'Endereço do Consultório',
          valor1: 'Av. das Américas, 500 - Barra da Tijuca - Rio de Janeiro/RJ - CEP 22640-100',
          valor2: 'Rua Visconde de Pirajá, 550 - Ipanema - Rio de Janeiro/RJ - CEP 22410-002',
          registro1: {
            fonte: 'Hospital Ortopédico RJ',
            ultimaAtualizacao: '2025-06-20',
          },
          registro2: {
            fonte: 'Clínica Ortoped',
            ultimaAtualizacao: '2025-09-30',
          }
        },
      ],
    },
    {
      id: 4,
      medico: 'Dra. Mariana Costa',
      crm: '23456-SP',
      especialidade: 'Dermatologia',
      dataDeteccao: '2025-10-27',
      status: 'pendente',
      similaridade: 96,
      conflitos: [
        {
          tipo: 'telefones',
          campo: 'Telefone Celular',
          valor1: '(11) 97777-8888',
          valor2: '(11) 96666-5555',
          registro1: {
            fonte: 'Clínica Derma Plus',
            ultimaAtualizacao: '2025-10-01',
          },
          registro2: {
            fonte: 'Hospital Estética',
            ultimaAtualizacao: '2025-10-20',
          }
        },
        {
          tipo: 'telefones',
          campo: 'Telefone Comercial',
          valor1: '(11) 3333-2222',
          valor2: '(11) 4444-1111',
          registro1: {
            fonte: 'Clínica Derma Plus',
            ultimaAtualizacao: '2025-09-15',
          },
          registro2: {
            fonte: 'Hospital Estética',
            ultimaAtualizacao: '2025-10-18',
          }
        },
      ],
    },
    {
      id: 5,
      medico: 'Dr. Fernando Alves',
      crm: '34567-MG',
      especialidade: 'Neurologia',
      dataDeteccao: '2025-10-26',
      status: 'pendente',
      similaridade: 91,
      conflitos: [
        {
          tipo: 'emails',
          campo: 'E-mail Principal',
          valor1: 'fernando.alves@neuro.com.br',
          valor2: 'dr.fernando@neurologia.med.br',
          registro1: {
            fonte: 'Instituto Neurológico MG',
            ultimaAtualizacao: '2025-08-20',
          },
          registro2: {
            fonte: 'Clínica NeuroSaúde',
            ultimaAtualizacao: '2025-10-12',
          }
        },
        {
          tipo: 'emails',
          campo: 'E-mail Secundário',
          valor1: 'contato@fernando.med.br',
          valor2: 'atendimento@drnando.com.br',
          registro1: {
            fonte: 'Instituto Neurológico MG',
            ultimaAtualizacao: '2025-07-10',
          },
          registro2: {
            fonte: 'Clínica NeuroSaúde',
            ultimaAtualizacao: '2025-09-25',
          }
        },
      ],
    },
    {
      id: 6,
      medico: 'Dra. Juliana Fernandes',
      crm: '45678-RS',
      especialidade: 'Ginecologia',
      dataDeteccao: '2025-10-25',
      status: 'pendente',
      similaridade: 89,
      conflitos: [
        {
          tipo: 'enderecos',
          campo: 'Endereço Consultório Principal',
          valor1: 'Rua dos Andradas, 1234 - Centro - Porto Alegre/RS - CEP 90020-000',
          valor2: 'Av. Independência, 890 - Moinhos de Vento - Porto Alegre/RS - CEP 90035-070',
          registro1: {
            fonte: 'Hospital Mãe de Deus',
            ultimaAtualizacao: '2025-08-15',
          },
          registro2: {
            fonte: 'Clínica da Mulher',
            ultimaAtualizacao: '2025-10-10',
          }
        },
        {
          tipo: 'enderecos',
          campo: 'Endereço Consultório Secundário',
          valor1: 'Rua Ramiro Barcelos, 2350 - Santana - Porto Alegre/RS - CEP 90035-903',
          valor2: 'Av. Carlos Gomes, 700 - Boa Vista - Porto Alegre/RS - CEP 90480-000',
          registro1: {
            fonte: 'Hospital Mãe de Deus',
            ultimaAtualizacao: '2025-06-30',
          },
          registro2: {
            fonte: 'Clínica da Mulher',
            ultimaAtualizacao: '2025-09-15',
          }
        },
      ],
    },
    {
      id: 7,
      medico: 'Dr. Paulo Henrique Santos',
      crm: '56789-BA',
      especialidade: 'Urologia',
      dataDeteccao: '2025-10-24',
      status: 'resolvido',
      similaridade: 93,
      conflitos: [
        {
          tipo: 'nome',
          campo: 'Nome Completo',
          valor1: 'Dr. Paulo Henrique dos Santos',
          valor2: 'Dr. Paulo H. Santos',
          resolucao: 'manter_primeiro',
          registro1: {
            fonte: 'Hospital São Rafael',
            ultimaAtualizacao: '2025-09-01',
          },
          registro2: {
            fonte: 'Clínica Uro+',
            ultimaAtualizacao: '2025-09-28',
          }
        },
      ],
      decisao: 'Nome Completo: mantido primeiro (Dr. Paulo Henrique dos Santos)',
    },
    {
      id: 8,
      medico: 'Dra. Beatriz Oliveira',
      crm: '67890-PR',
      especialidade: 'Oftalmologia',
      dataDeteccao: '2025-10-23',
      status: 'pendente',
      similaridade: 94,
      conflitos: [
        {
          tipo: 'nome',
          campo: 'Nome Completo',
          valor1: 'Dra. Beatriz Oliveira Silva',
          valor2: 'Dra. Beatriz O. Silva',
          registro1: {
            fonte: 'Hospital de Olhos Curitiba',
            ultimaAtualizacao: '2025-09-20',
          },
          registro2: {
            fonte: 'Clínica OftalmoVision',
            ultimaAtualizacao: '2025-10-15',
          }
        },
        {
          tipo: 'telefones',
          campo: 'Telefone Celular',
          valor1: '(41) 99888-7777',
          valor2: '(41) 98777-6666',
          registro1: {
            fonte: 'Hospital de Olhos Curitiba',
            ultimaAtualizacao: '2025-08-25',
          },
          registro2: {
            fonte: 'Clínica OftalmoVision',
            ultimaAtualizacao: '2025-10-10',
          }
        },
        {
          tipo: 'emails',
          campo: 'E-mail Profissional',
          valor1: 'beatriz.silva@hospitalolhos.com.br',
          valor2: 'dra.beatriz@oftalmovision.com.br',
          registro1: {
            fonte: 'Hospital de Olhos Curitiba',
            ultimaAtualizacao: '2025-07-30',
          },
          registro2: {
            fonte: 'Clínica OftalmoVision',
            ultimaAtualizacao: '2025-10-05',
          }
        },
        {
          tipo: 'enderecos',
          campo: 'Endereço do Consultório',
          valor1: 'Av. Cândido de Abreu, 526 - Centro Cívico - Curitiba/PR - CEP 80530-000',
          valor2: 'Rua Visconde de Nácar, 1440 - Batel - Curitiba/PR - CEP 80410-201',
          registro1: {
            fonte: 'Hospital de Olhos Curitiba',
            ultimaAtualizacao: '2025-06-15',
          },
          registro2: {
            fonte: 'Clínica OftalmoVision',
            ultimaAtualizacao: '2025-09-20',
          }
        },
      ],
    },
  ]);

  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<DuplicacaoMedico | null>(null);
  const [conflitoAtualIndex, setConflitoAtualIndex] = useState(0);
  const [resolucoes, setResolucoes] = useState<Map<number, { opcao: OpcaoResolucao; valor?: string }>>(new Map());
  const [valorPersonalizado, setValorPersonalizado] = useState('');

  const columns: ColumnDef<DuplicacaoMedico>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'medico',
      header: 'Médico',
    },
    {
      accessorKey: 'crm',
      header: 'CRM',
    },
    {
      accessorKey: 'especialidade',
      header: 'Especialidade',
    },
    {
      accessorKey: 'similaridade',
      header: 'Similaridade',
      cell: ({ row }) => {
        const similaridade = row.original.similaridade || 0;
        return (
          <span className="font-medium">
            {similaridade}%
          </span>
        );
      },
    },
    {
      accessorKey: 'dataDeteccao',
      header: 'Detectado em',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === 'resolvido'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {status === 'resolvido' ? 'Resolvido' : 'Pendente'}
          </span>
        );
      },
    },
    {
      accessorKey: 'decisao',
      header: 'Decisão',
      cell: ({ row }) => {
        const decisao = row.original.decisao;
        return decisao ? (
          <span className="text-sm text-muted-foreground">{decisao}</span>
        ) : (
          <span className="text-sm text-muted-foreground italic">-</span>
        );
      },
    },
  ];

  const tipoConflitoLabel: Record<TipoConflito, string> = {
    nome: 'Nome',
    enderecos: 'Endereços',
    telefones: 'Telefones',
    emails: 'E-mails',
  };

  const handleRowClick = (solicitacao: DuplicacaoMedico) => {
    if (solicitacao.status === 'pendente') {
      setSolicitacaoSelecionada(solicitacao);
      setConflitoAtualIndex(0);
      setResolucoes(new Map());
      setValorPersonalizado('');
    }
  };

  const handleVoltar = () => {
    setSolicitacaoSelecionada(null);
    setConflitoAtualIndex(0);
    setResolucoes(new Map());
    setValorPersonalizado('');
  };

  const handleResolucaoChange = (opcao: OpcaoResolucao) => {
    const novasResolucoes = new Map(resolucoes);
    novasResolucoes.set(conflitoAtualIndex, { opcao, valor: valorPersonalizado });
    setResolucoes(novasResolucoes);
  };

  const handleProximoConflito = () => {
    const resolucaoAtual = resolucoes.get(conflitoAtualIndex);
    if (!resolucaoAtual) {
      alert('Selecione uma opção de resolução');
      return;
    }

    if (resolucaoAtual.opcao === 'inserir_valor' && !valorPersonalizado) {
      alert('Digite um valor personalizado');
      return;
    }

    if (solicitacaoSelecionada && conflitoAtualIndex < solicitacaoSelecionada.conflitos.length - 1) {
      setConflitoAtualIndex(conflitoAtualIndex + 1);
      setValorPersonalizado('');
    } else {
      finalizarResolucao();
    }
  };

  const finalizarResolucao = () => {
    if (!solicitacaoSelecionada) return;

    const decisoes: string[] = [];
    solicitacaoSelecionada.conflitos.forEach((conflito, index) => {
      const resolucao = resolucoes.get(index);
      if (resolucao) {
        const campo = conflito.campo;
        switch (resolucao.opcao) {
          case 'manter_primeiro':
            decisoes.push(`${campo}: mantido primeiro (${conflito.valor1})`);
            break;
          case 'manter_segundo':
            decisoes.push(`${campo}: mantido segundo (${conflito.valor2})`);
            break;
          case 'manter_ambos':
            decisoes.push(`${campo}: mantidos ambos`);
            break;
          case 'descartar_ambos':
            decisoes.push(`${campo}: descartados ambos`);
            break;
          case 'inserir_valor':
            decisoes.push(`${campo}: valor personalizado (${resolucao.valor})`);
            break;
        }
      }
    });

    setSolicitacoes(
      solicitacoes.map((s) =>
        s.id === solicitacaoSelecionada.id
          ? {
              ...s,
              status: 'resolvido' as StatusSolicitacao,
              decisao: decisoes.join(', '),
              conflitos: s.conflitos.map((c, idx) => {
                const res = resolucoes.get(idx);
                return {
                  ...c,
                  resolucao: res?.opcao,
                  valorPersonalizado: res?.valor,
                };
              }),
            }
          : s
      )
    );

    handleVoltar();
  };

  if (solicitacaoSelecionada) {
    const conflito = solicitacaoSelecionada.conflitos[conflitoAtualIndex];
    const resolucaoAtual = resolucoes.get(conflitoAtualIndex);
    const isUltimoConflito = conflitoAtualIndex === solicitacaoSelecionada.conflitos.length - 1;

    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleVoltar}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Deduplicação - {solicitacaoSelecionada.medico}</h1>
              <p className="text-muted-foreground mt-2">
                Resolvendo conflito {conflitoAtualIndex + 1} de {solicitacaoSelecionada.conflitos.length}
              </p>
            </div>
          </div>

          {/* Informações da Duplicação */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Dados da Duplicação Detectada</h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Médico: </span>
                <span className="text-blue-900">{solicitacaoSelecionada.medico}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">CRM: </span>
                <span className="text-blue-900">{solicitacaoSelecionada.crm}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Especialidade: </span>
                <span className="text-blue-900">{solicitacaoSelecionada.especialidade}</span>
              </div>
              {solicitacaoSelecionada.similaridade && (
                <div>
                  <span className="text-blue-700 font-medium">Similaridade: </span>
                  <span className="text-blue-900 font-bold">{solicitacaoSelecionada.similaridade}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="space-y-6">
              {/* Título do Conflito */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-red-600">
                      Conflito: {conflito.campo}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tipo: {tipoConflitoLabel[conflito.tipo]}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Requer Decisão
                    </span>
                  </div>
                </div>
              </div>

              {/* Comparação de Registros Duplicados */}
              <div className="grid grid-cols-2 gap-6">
                <div className="border-2 border-purple-200 rounded-lg p-5 bg-purple-50 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-bold text-purple-900">Registro 1</Label>
                    <span className="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded font-medium">
                      {conflito.registro1.fonte}
                    </span>
                  </div>
                  <p className="text-base text-purple-900 mb-3 min-h-[3rem] font-medium">
                    {conflito.valor1}
                  </p>
                  <p className="text-xs text-purple-700">
                    Última atualização: {conflito.registro1.ultimaAtualizacao}
                  </p>
                </div>

                <div className="border-2 border-green-200 rounded-lg p-5 bg-green-50 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-bold text-green-900">Registro 2</Label>
                    <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded font-medium">
                      {conflito.registro2.fonte}
                    </span>
                  </div>
                  <p className="text-base text-green-900 mb-3 min-h-[3rem] font-medium">
                    {conflito.valor2}
                  </p>
                  <p className="text-xs text-green-700">
                    Última atualização: {conflito.registro2.ultimaAtualizacao}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Escolha uma opção:</Label>
                <RadioGroup
                  value={resolucaoAtual?.opcao || ''}
                  onValueChange={(value: string) => handleResolucaoChange(value as OpcaoResolucao)}
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="manter_primeiro" id="opt1" />
                    <Label htmlFor="opt1" className="cursor-pointer flex-1">
                      Manter o primeiro valor
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="manter_segundo" id="opt2" />
                    <Label htmlFor="opt2" className="cursor-pointer flex-1">
                      Manter o segundo valor
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="manter_ambos" id="opt3" />
                    <Label htmlFor="opt3" className="cursor-pointer flex-1">
                      Manter ambos os valores
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="descartar_ambos" id="opt4" />
                    <Label htmlFor="opt4" className="cursor-pointer flex-1">
                      Descartar ambos os valores
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="inserir_valor" id="opt5" />
                      <Label htmlFor="opt5" className="cursor-pointer flex-1">
                        Inserir um novo valor
                      </Label>
                    </div>
                    {resolucaoAtual?.opcao === 'inserir_valor' && (
                      <Input
                        placeholder="Digite o novo valor..."
                        value={valorPersonalizado}
                        onChange={(e) => {
                          setValorPersonalizado(e.target.value);
                          const novasResolucoes = new Map(resolucoes);
                          novasResolucoes.set(conflitoAtualIndex, {
                            opcao: 'inserir_valor',
                            valor: e.target.value,
                          });
                          setResolucoes(novasResolucoes);
                        }}
                        className="ml-6"
                      />
                    )}
                  </div>
                </RadioGroup>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={handleProximoConflito}>
                  {isUltimoConflito ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Finalizar
                    </>
                  ) : (
                    'Próximo Conflito'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Solicitações de Deduplicação</h1>
          <p className="text-muted-foreground mt-2">
            Resolva duplicações detectadas na base de médicos
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <DataTable
            columns={columns}
            data={solicitacoes}
            searchKey="medico"
            searchPlaceholder="Buscar por médico..."
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Solicitacoes;
