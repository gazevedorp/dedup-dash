import { useState, useEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, ArrowLeft, Check } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { solicitacoesApi, type Solicitacao } from '@/api/solicitacoes.api';

type TipoConflito = 'nome' | 'enderecos' | 'telefones' | 'emails';
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

interface SolicitacaoDetalhada extends Solicitacao {
  conflitos?: Conflito[];
  similaridade?: number;
  medico?: string;
  crm?: string;
  especialidade?: string;
}

const Solicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoDetalhada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<SolicitacaoDetalhada | null>(null);
  const [conflitoAtualIndex, setConflitoAtualIndex] = useState(0);
  const [resolucoes, setResolucoes] = useState<Map<number, { opcao: OpcaoResolucao; valor?: string }>>(new Map());
  const [valorPersonalizado, setValorPersonalizado] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    solicitante: '',
    prioridade: 'Média',
    status: 'Aguardando',
    dataPrevisao: '',
  });

  // Carregar solicitações ao montar o componente
  useEffect(() => {
    loadSolicitacoes();
  }, []);

  const loadSolicitacoes = async () => {
    try {
      setIsLoading(true);
      const data = await solicitacoesApi.getAll();
      setSolicitacoes(data);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      alert('Erro ao carregar solicitações');
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<SolicitacaoDetalhada>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'titulo',
      header: 'Título',
    },
    {
      accessorKey: 'solicitante',
      header: 'Solicitante',
    },
    {
      accessorKey: 'prioridade',
      header: 'Prioridade',
      cell: ({ row }) => {
        const prioridade = row.original.prioridade;
        const colors: Record<string, string> = {
          Urgente: 'bg-red-100 text-red-800',
          Alta: 'bg-orange-100 text-orange-800',
          Média: 'bg-yellow-100 text-yellow-800',
          Baixa: 'bg-green-100 text-green-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[prioridade] || 'bg-gray-100 text-gray-800'}`}>
            {prioridade}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const colors: Record<string, string> = {
          Concluído: 'bg-green-100 text-green-800',
          'Em andamento': 'bg-blue-100 text-blue-800',
          Aguardando: 'bg-yellow-100 text-yellow-800',
          Cancelado: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'dataAbertura',
      header: 'Data Abertura',
    },
  ];

  const tipoConflitoLabel: Record<TipoConflito, string> = {
    nome: 'Nome',
    enderecos: 'Endereços',
    telefones: 'Telefones',
    emails: 'E-mails',
  };

  const handleOpenModal = () => {
    setFormData({
      titulo: '',
      descricao: '',
      solicitante: '',
      prioridade: 'Média',
      status: 'Aguardando',
      dataPrevisao: '',
    });
    setIsModalOpen(true);
  };

  const handleRowClick = async (solicitacao: SolicitacaoDetalhada) => {
    try {
      // Buscar conflitos da API
      const conflitosData = await solicitacoesApi.getConflitos(solicitacao.id);

      // Se tem conflitos, abre tela de resolução
      if (conflitosData.conflitos && conflitosData.conflitos.length > 0) {
        const solicitacaoComConflitos = {
          ...solicitacao,
          ...conflitosData,
        };
        setSolicitacaoSelecionada(solicitacaoComConflitos);
        setConflitoAtualIndex(0);
        setResolucoes(new Map());
        setValorPersonalizado('');
      } else {
        alert('Esta solicitação não possui conflitos a serem resolvidos');
      }
    } catch (error) {
      console.error('Erro ao carregar conflitos:', error);
      alert('Erro ao carregar conflitos');
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

    if (solicitacaoSelecionada && solicitacaoSelecionada.conflitos && conflitoAtualIndex < solicitacaoSelecionada.conflitos.length - 1) {
      setConflitoAtualIndex(conflitoAtualIndex + 1);
      setValorPersonalizado('');
    } else {
      finalizarResolucao();
    }
  };

  const finalizarResolucao = async () => {
    if (!solicitacaoSelecionada) return;

    const decisoes: string[] = [];
    solicitacaoSelecionada.conflitos?.forEach((conflito, index) => {
      const resolucao = resolucoes.get(index);
      if (resolucao) {
        const campo = conflito.campo;
        switch (resolucao.opcao) {
          case 'manter_primeiro':
            decisoes.push(`${campo}: mantido primeiro`);
            break;
          case 'manter_segundo':
            decisoes.push(`${campo}: mantido segundo`);
            break;
          case 'manter_ambos':
            decisoes.push(`${campo}: mantidos ambos`);
            break;
          case 'descartar_ambos':
            decisoes.push(`${campo}: descartados ambos`);
            break;
          case 'inserir_valor':
            decisoes.push(`${campo}: valor personalizado`);
            break;
        }
      }
    });

    try {
      // Atualizar status para Concluído
      await solicitacoesApi.update(solicitacaoSelecionada.id, {
        status: 'Concluído',
        descricao: `${solicitacaoSelecionada.descricao}\n\nResoluções: ${decisoes.join(', ')}`,
      });

      await loadSolicitacoes();
      handleVoltar();
    } catch (error) {
      console.error('Erro ao finalizar resolução:', error);
      alert('Erro ao finalizar resolução');
    }
  };

  const handleSave = async () => {
    if (!formData.titulo || !formData.descricao || !formData.solicitante || !formData.prioridade) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await solicitacoesApi.create(formData);
      await loadSolicitacoes();
      setIsModalOpen(false);
      setFormData({
        titulo: '',
        descricao: '',
        solicitante: '',
        prioridade: 'Média',
        status: 'Aguardando',
        dataPrevisao: '',
      });
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      alert('Erro ao criar solicitação');
    }
  };

  // Tela de Resolução de Conflitos
  if (solicitacaoSelecionada && solicitacaoSelecionada.conflitos) {
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
              <h1 className="text-3xl font-bold">Resolução de Conflitos - {solicitacaoSelecionada.titulo}</h1>
              <p className="text-muted-foreground mt-2">
                Resolvendo conflito {conflitoAtualIndex + 1} de {solicitacaoSelecionada.conflitos.length}
              </p>
            </div>
          </div>

          {solicitacaoSelecionada.medico && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Dados da Solicitação</h3>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Médico: </span>
                  <span className="text-blue-900">{solicitacaoSelecionada.medico}</span>
                </div>
                {solicitacaoSelecionada.crm && (
                  <div>
                    <span className="text-blue-700 font-medium">CRM: </span>
                    <span className="text-blue-900">{solicitacaoSelecionada.crm}</span>
                  </div>
                )}
                {solicitacaoSelecionada.especialidade && (
                  <div>
                    <span className="text-blue-700 font-medium">Especialidade: </span>
                    <span className="text-blue-900">{solicitacaoSelecionada.especialidade}</span>
                  </div>
                )}
                {solicitacaoSelecionada.similaridade && (
                  <div>
                    <span className="text-blue-700 font-medium">Similaridade: </span>
                    <span className="text-blue-900 font-bold">{solicitacaoSelecionada.similaridade}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-card border rounded-lg p-6">
            <div className="space-y-6">
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

  // Tela Principal de Listagem
  return (
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Solicitações</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie as solicitações do sistema e resolva conflitos
            </p>
          </div>
          <Button onClick={handleOpenModal}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Solicitação
          </Button>
        </div>

        <div className="bg-card border rounded-lg p-6">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando solicitações...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={solicitacoes}
              searchKey="titulo"
              searchPlaceholder="Buscar por título..."
              onRowClick={handleRowClick}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Solicitação"
        onSave={handleSave}
        saveText="Criar"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              placeholder="Título da solicitação"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <textarea
              id="descricao"
              placeholder="Descrição detalhada da solicitação"
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solicitante">Solicitante</Label>
            <Input
              id="solicitante"
              placeholder="Nome do solicitante"
              value={formData.solicitante}
              onChange={(e) =>
                setFormData({ ...formData, solicitante: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade</Label>
              <select
                id="prioridade"
                value={formData.prioridade}
                onChange={(e) =>
                  setFormData({ ...formData, prioridade: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Aguardando">Aguardando</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataPrevisao">Data de Previsão</Label>
            <Input
              id="dataPrevisao"
              type="date"
              value={formData.dataPrevisao}
              onChange={(e) =>
                setFormData({ ...formData, dataPrevisao: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Solicitacoes;
